package com.financey.domain.service

import arrow.core.Either
import arrow.core.continuations.either
import com.financey.constants.CurrencyConstants
import com.financey.domain.error.ExchangeRateError
import com.financey.domain.error.FinanceyError
import com.financey.domain.model.InvestmentEntryDomain
import org.openapitools.model.EntryCurrency
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

    suspend fun getProfitByDate(
        date: LocalDate, investmentTransactions: List<InvestmentEntryDomain>,
        excludePurchasesFrom: LocalDate?):
            Either<FinanceyError, BigDecimal> = either {
        val filteredInvestments = excludePurchasesFrom?.let {
                excludeDate -> investmentTransactions
            .filter {
                if (it.entry.entryType == EntryType.EXPENSE) it.entry.date < excludeDate else true
            }
        } ?: investmentTransactions

        val moneyFromOperations = findProfitFromOperations(date, filteredInvestments).bind()
        val currentMarketValue = getCurrentMarketValue(filteredInvestments, date).bind()

        currentMarketValue - moneyFromOperations
    }

    private suspend fun getCurrentMarketValue(
        filteredInvestments: List<InvestmentEntryDomain>,
        date: LocalDate
    ): Either<ExchangeRateError, BigDecimal> = either {
        filteredInvestments
            .filter { it.entry.entryType == EntryType.EXPENSE }
            .map { findMostRecentEntryValue(it, date).bind() }
            .reduceOrNull { a, b -> a.plus(b) } ?: BigDecimal.ZERO
    }

    private suspend fun findMostRecentEntryValue(
        investment: InvestmentEntryDomain,
        date: LocalDate
    ): Either<ExchangeRateError, BigDecimal> = either {
        val datesToPricesFiltered = investment.datesToMarketPrices
            .filter { it.key <= date }
            .maxByOrNull { it.key }

        val priceInBaseCurrency = findPriceFromDateInBaseCurrency(investment.entry.currency, datesToPricesFiltered).bind()

        priceInBaseCurrency * investment.volume
    }

    private suspend fun findPriceFromDateInBaseCurrency(
        currency: EntryCurrency,
        dateToPrice: Map.Entry<LocalDate, BigDecimal>?
    ): Either<ExchangeRateError, BigDecimal> = either {
        if (currency!= CurrencyConstants.BASE_CURRENCY) {
            dateToPrice?.let {
                currencyService.exchange(
                    Pair(currency, CurrencyConstants.BASE_CURRENCY),
                    it.value,
                    it.key).bind()
            }  ?: BigDecimal.ZERO
        } else {
            dateToPrice?.value ?: BigDecimal.ZERO
        }
    }

    private suspend fun findProfitFromOperations(date: LocalDate, investments: List<InvestmentEntryDomain>):
            Either<ExchangeRateError, BigDecimal> = either {
        -(expenseCalculatorService.findBalanceForPeriodFromEntries(investments.map { it.entry }, null, date)).bind()
    }

}

typealias DatePriceSelector = (Map<LocalDate, BigDecimal>) -> Map.Entry<LocalDate, BigDecimal>?

private inline operator fun BigDecimal.times(other: Int): BigDecimal = this.times(BigDecimal(other))
