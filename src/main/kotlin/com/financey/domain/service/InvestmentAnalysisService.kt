package com.financey.domain.service

import arrow.core.Either
import arrow.core.continuations.either
import com.financey.domain.error.FinanceyError
import com.financey.domain.mapper.EntryDomainMapper
import com.financey.repository.InvestmentEntryRepository
import mu.KotlinLogging
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.time.LocalDate

@Service
class InvestmentAnalysisService(
    @Autowired private val profitCalculatorService: ProfitCalculatorService,
    @Autowired private val investmentEntryRepository: InvestmentEntryRepository,
    @Autowired private val entryDomainMapper: EntryDomainMapper
) {

    val logger = KotlinLogging.logger {}

    suspend fun getProfitByDateAndId(
        date: LocalDate,
        budgetId: String,
        excludePurchasesFrom: LocalDate?
    ):
            Either<FinanceyError, BigDecimal> = either {
        val investmentEntriesFromPeriod = investmentEntryRepository
            .getAllByBudgetIdBeforeOrEqualDate(budgetId, date).bind()
            .map { entryDomainMapper.toInvestmentDomain(it) }
        logger.debug { "Retrieved investment entries for profit analysis for budgetId: $budgetId, " +
                "exclude date: $excludePurchasesFrom" }

        profitCalculatorService.getProfitByDate(date, investmentEntriesFromPeriod,
            excludePurchasesFrom).bind()
    }

}