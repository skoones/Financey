package com.financey.domain.service

import arrow.core.Either
import arrow.core.continuations.either
import com.financey.domain.error.FinanceyError
import com.financey.domain.model.InvestmentEntryDomain
import org.openapitools.model.EntryType
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.time.LocalDate

@Service
class ProfitCalculatorService(
    @Autowired private val expenseCalculatorService: ExpenseCalculatorService
) {

    suspend fun getProfitByPeriodAndId(period: Pair<LocalDate, LocalDate>, investments: List<InvestmentEntryDomain>,
                                       excludePurchasesFrom: LocalDate?):
            Either<FinanceyError, BigDecimal> = either {
        val (startDate, endDate) = period

        val filteredInvestments = excludePurchasesFrom?.let {
                excludeDate -> investments
            .filter {
                if (it.entry.entryType == EntryType.EXPENSE) it.entry.date < excludeDate else true
            }
        } ?: investments

        val profitFromOperations = expenseCalculatorService.findBalanceForPeriodFromEntries(
            filteredInvestments.map { it.entry }, startDate, endDate).bind()

        val profitFromPriceChanges = getProfitFromPriceChanges(filteredInvestments, period)

        profitFromOperations + profitFromPriceChanges
    }

    private fun getProfitFromPriceChanges(
        filteredInvestments: List<InvestmentEntryDomain>,
        period: Pair<LocalDate, LocalDate>
    ): BigDecimal = filteredInvestments
        .filter { it.entry.entryType == EntryType.EXPENSE }
        .map { calculateProfitFromPriceChange(it, period) }
        .reduceOrNull { a, b -> a.plus(b) } ?: BigDecimal.ZERO

    private fun calculateProfitFromPriceChange(investment: InvestmentEntryDomain, period: Pair<LocalDate, LocalDate>):
            BigDecimal {
        val datesToPricesFiltered = investment.datesToMarketPrices.filter { it.key >= period.first && it.key <= period.second }

        val earliestPrice = datesToPricesFiltered.minByOrNull { it.key }?.value ?: BigDecimal.ZERO
        val latestPrice = datesToPricesFiltered.maxByOrNull { it.key }?.value ?: BigDecimal.ZERO

        return (latestPrice - earliestPrice) * investment.volume
    }

}

private inline operator fun BigDecimal.times(other: Int): BigDecimal = this.times(BigDecimal(other))
