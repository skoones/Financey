package com.financey.domain.service

import arrow.core.Either
import arrow.core.continuations.either
import com.financey.constants.CurrencyConstants
import com.financey.domain.error.ExchangeRateError
import com.financey.domain.error.FinanceyError
import com.financey.domain.model.InvestmentEntryDomain
import org.openapitools.model.EntryType
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.time.LocalDate

@Service
class ProfitCalculatorService(
    @Autowired private val expenseCalculatorService: ExpenseCalculatorService,
    @Autowired private val currencyService: CurrencyService
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

        val profitFromPriceChanges = getProfitFromPriceChanges(filteredInvestments, period).bind()

        profitFromOperations + profitFromPriceChanges
    }

    private suspend fun getProfitFromPriceChanges(
        filteredInvestments: List<InvestmentEntryDomain>,
        period: Pair<LocalDate, LocalDate>
    ): Either<ExchangeRateError, BigDecimal> = either {
        filteredInvestments
            .filter { it.entry.entryType == EntryType.EXPENSE }
            .map { calculateProfitFromPriceChange(it, period).bind() }
            .reduceOrNull { a, b -> a.plus(b) } ?: BigDecimal.ZERO
    }

    private suspend fun calculateProfitFromPriceChange(investment: InvestmentEntryDomain,
                                                       period: Pair<LocalDate, LocalDate>):
            Either<ExchangeRateError, BigDecimal> = either {
        val datesToPricesFiltered = investment.datesToMarketPrices
            .filter { it.key >= period.first && it.key <= period.second }

        val earliestPrice = findPriceFromDateInBaseCurrency(investment, datesToPricesFiltered) {
            it.minByOrNull { entry -> entry.key }
        }.bind()
        val latestPrice = findPriceFromDateInBaseCurrency(investment, datesToPricesFiltered) {
            it.maxByOrNull { entry -> entry.key }
        }.bind()

        (latestPrice - earliestPrice) * investment.volume
    }

    private suspend fun findPriceFromDateInBaseCurrency(
        investment: InvestmentEntryDomain,
        datesToPricesFiltered: Map<LocalDate, BigDecimal>,
        selector: DatePriceSelector
    ): Either<ExchangeRateError, BigDecimal> = either {
        if (investment.entry.currency != CurrencyConstants.BASE_CURRENCY) {
            val dateToPrice = selector(datesToPricesFiltered)
            dateToPrice?.let {
                currencyService.exchange(
                    Pair(investment.entry.currency, CurrencyConstants.BASE_CURRENCY),
                    it.value,
                    dateToPrice.key
                ).bind()
            } ?: BigDecimal.ZERO
        } else {
            selector(datesToPricesFiltered)?.value ?: BigDecimal.ZERO
        }
    }

}

typealias DatePriceSelector = (Map<LocalDate, BigDecimal>) -> Map.Entry<LocalDate, BigDecimal>?

private inline operator fun BigDecimal.times(other: Int): BigDecimal = this.times(BigDecimal(other))
