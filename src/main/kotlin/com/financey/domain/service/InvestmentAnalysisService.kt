package com.financey.domain.service

import arrow.core.Either
import arrow.core.continuations.either
import com.financey.domain.error.FinanceyError
import com.financey.domain.mapper.EntryDomainMapper
import com.financey.repository.InvestmentEntryRepository
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

    suspend fun getProfitByPeriodAndId(
        startDate: LocalDate,
        endDate: LocalDate,
        budgetId: String,
        excludePurchasesFrom: LocalDate?
    ):
            Either<FinanceyError, BigDecimal> = either {
        val investmentEntriesFromPeriod = investmentEntryRepository
            .getAllByBudgetIdAndPeriod(budgetId, startDate, endDate).bind()
            .map { entryDomainMapper.toInvestmentDomain(it) }

        profitCalculatorService.getProfitByPeriodAndId(Pair(startDate, endDate), investmentEntriesFromPeriod,
            excludePurchasesFrom).bind()
    }

}