package com.financey.domain.service

import arrow.core.Either
import arrow.core.continuations.either
import com.financey.domain.error.FinanceyError
import com.financey.domain.mapper.EntryDomainMapper
import com.financey.domain.model.SubcategoryMarketValueDomain
import com.financey.repository.BudgetCategoryRepository
import com.financey.repository.BudgetRepository
import com.financey.repository.InvestmentEntryRepository
import mu.KotlinLogging
import org.openapitools.model.EntryType
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.time.LocalDate

@Service
class InvestmentAnalysisService(
    @Autowired private val profitCalculatorService: ProfitCalculatorService,
    @Autowired private val budgetAnalysisService: BudgetAnalysisService,
    @Autowired private val investmentEntryRepository: InvestmentEntryRepository,
    @Autowired private val budgetRepository: BudgetRepository,
    @Autowired private val budgetCategoryRepository: BudgetCategoryRepository,
    @Autowired private val entryDomainMapper: EntryDomainMapper
) {

    val logger = KotlinLogging.logger {}

    suspend fun getProfitByDateAndId(
        date: LocalDate,
        budgetId: String,
        excludePurchasesFrom: LocalDate?
    ): Either<FinanceyError, BigDecimal> = either {
        val investmentEntriesFromPeriod = investmentEntryRepository
            .getAllByBudgetIdBeforeOrEqualDate(budgetId, date).bind()
            .map { entryDomainMapper.toInvestmentDomain(it) }
        logger.debug { "Retrieved investment entries for profit analysis for budgetId: $budgetId, " +
                "exclude date: $excludePurchasesFrom" }

        profitCalculatorService.getProfitByDate(date, investmentEntriesFromPeriod,
            excludePurchasesFrom).bind()
    }

    suspend fun getTotalMarketValueForSubcategoriesAndPeriodByCategoryId(
        startDate: LocalDate,
        endDate: LocalDate,
        budgetCategoryId: String
    ): Either<FinanceyError, List<SubcategoryMarketValueDomain>> = either {
        val subcategoryToBudgets = budgetAnalysisService.findSubcategoryToBudgets(budgetCategoryId).bind()

        val subcategoryToBuyEntries = subcategoryToBudgets
            .mapValues { investmentEntryRepository.getAllByBudgetIdsAndPeriod(startDate, endDate,
                it.value.map { budget -> budget.id }).bind()
                .filter { investmentEntry -> investmentEntry.entry.entryType == EntryType.EXPENSE }
                .map { investmentEntryDto -> entryDomainMapper.toInvestmentDomain(investmentEntryDto) } }

        profitCalculatorService.findMarketValueContexts(subcategoryToBuyEntries, endDate).bind()
    }

    suspend fun getProfitByDateAndCategoryId(date: LocalDate, budgetCategoryId: String,
                                             excludePurchasesFrom: LocalDate?):
            Either<FinanceyError, BigDecimal> = either {
        val childrenCategories = budgetCategoryRepository.getAllByParentId(budgetCategoryId).bind()
        childrenCategories.map {
            budgetRepository.getAllByCategoryId(it.id?.toString() ?: "").bind()
        }.flatMap { budgets -> budgets.map {
                    getProfitByDateAndId(date, it.id?.toString() ?: "", excludePurchasesFrom).bind()
                }
        }.reduceOrNull { a, b -> a + b } ?: BigDecimal.ZERO
    }

}