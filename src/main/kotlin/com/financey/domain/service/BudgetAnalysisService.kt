package com.financey.domain.service

import arrow.core.Either
import arrow.core.continuations.either
import com.financey.domain.error.FinanceyError
import com.financey.domain.mapper.BudgetDomainMapper
import com.financey.domain.mapper.EntryDomainMapper
import com.financey.domain.model.SubcategoryExpenseSumDomain
import com.financey.repository.BudgetCategoryRepository
import com.financey.repository.BudgetRepository
import com.financey.repository.EntryRepository
import com.financey.utils.CommonUtils.objectIdToString
import org.openapitools.model.EntryType
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.time.LocalDate

@Service
class BudgetAnalysisService(
    @Autowired private val expenseCalculatorService: ExpenseCalculatorService,
    @Autowired private val entryRepository: EntryRepository,
    @Autowired private val budgetCategoryRepository: BudgetCategoryRepository,
    @Autowired private val budgetRepository: BudgetRepository,
    @Autowired private val budgetDomainMapper: BudgetDomainMapper,
    @Autowired private val entryDomainMapper: EntryDomainMapper
) {

    // todo more descriptive error type?
    // todo refactor - tuples for periods?
    suspend fun getBalanceByPeriodAndId(startDate: LocalDate, endDate: LocalDate, budgetId: String):
            Either<FinanceyError, BigDecimal> = either {
        val entries = entryRepository.getAllByBudgetId(budgetId).bind()
            .map { entryDomainMapper.toDomain(it) }

        expenseCalculatorService.findBalanceForPeriodFromEntries(entries, startDate, endDate).bind()
    }

    suspend fun getTotalExpensesForSubcategoriesAndPeriodByCategoryId(
        startDate: LocalDate,
        endDate: LocalDate,
        budgetCategoryId: String
    ): Either<FinanceyError, List<SubcategoryExpenseSumDomain>> = either {
        val subcategoryToBudgets = findSubcategoryToBudgets(budgetCategoryId).bind()

        val subcategoryToExpenseEntries = subcategoryToBudgets
            .mapValues { entryRepository.getAllByBudgetIdsAndPeriod(startDate, endDate,
                it.value.map { budget -> budget.id }).bind()
                .filter { entry -> entry.entryType == EntryType.EXPENSE }
                .map { entry -> entryDomainMapper.toDomain(entry) } }

        expenseCalculatorService.findExpenseSumContexts(subcategoryToExpenseEntries).bind()
    }

    suspend fun findSubcategoryToBudgets(budgetCategoryId: String) = either {
        val idsToSubcategories = findIdsToSubcategories(budgetCategoryId).bind()

        budgetRepository.getAllByAncestorCategoryIds(idsToSubcategories.keys).bind()
            .flatMap { it.ancestorCategoryIds?.map { categoryId -> categoryId to it } ?: listOf() }
            .map { idsToSubcategories[it.first] to budgetDomainMapper.toDomain(it.second) }
            .groupBy({ it.first }, { it.second })
            .filterKeys { objectIdToString(it?.id) in idsToSubcategories.keys }
    }


    suspend fun getExpenseSumByPeriodAndId(startDate: LocalDate, endDate: LocalDate, budgetId: String):
            Either<FinanceyError, BigDecimal> = either {
        val entries = entryRepository.getAllByBudgetId(budgetId).bind()
            .map { entryDomainMapper.toDomain(it) }

        expenseCalculatorService.findExpenseSumForPeriodFromEntries(entries, startDate, endDate).bind()
    }

    private suspend fun findIdsToSubcategories(budgetCategoryId: String) = either {
        budgetCategoryRepository.getAllByParentId(budgetCategoryId).bind()
            .map { objectIdToString(it.id) to it }
            .associate { it.first to it.second }
    }

}
