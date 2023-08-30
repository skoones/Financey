package com.financey.domain.service

import arrow.core.Either
import arrow.core.continuations.either
import com.financey.constants.CurrencyConstants
import com.financey.domain.context.SubcategoryExpenseSumContext
import com.financey.domain.db.model.BudgetCategory
import com.financey.domain.error.ExchangeRateError
import com.financey.domain.model.EntryDomain
import com.financey.external.api.ExchangeRateApi
import com.financey.utils.CommonUtils
import org.openapitools.model.EntryType
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.time.LocalDate

@Service
class ExpenseCalculatorService(
    @Autowired private val exchangeRateApi: ExchangeRateApi
) {
    suspend fun findExpenseSumForPeriodFromEntries(
        entries: List<EntryDomain>,
        startDate: LocalDate,
        endDate: LocalDate
    ): Either<ExchangeRateError, BigDecimal> = either {
        entries
            .filter {
                it.date in startDate..endDate
            }
            .filter { it.entryType == EntryType.EXPENSE }
            .map { changeEntryToUseBaseCurrency(it).bind() }
            .map { it.value }
            .reduceOrNull { a, b -> a.plus(b) } ?: BigDecimal.ZERO
    }

    suspend fun findBalanceForPeriodFromEntries(
        entries: List<EntryDomain>,
        startDate: LocalDate,
        endDate: LocalDate
    ): Either<ExchangeRateError, BigDecimal> = either {
        entries
            .filter {
                it.date in startDate..endDate
            }
            .map { changeEntryToUseBaseCurrency(it).bind() }
            .map { if (it.entryType == EntryType.EXPENSE) it.value.negate() else it.value }
            .reduceOrNull { a, b -> a.plus(b) } ?: BigDecimal.ZERO
    }

    suspend fun findExpenseSumContexts(subcategoryToExpenseSum: Map<BudgetCategory?, List<EntryDomain>>):
            Either<ExchangeRateError, List<SubcategoryExpenseSumContext>> = either {
        subcategoryToExpenseSum
            .mapValues { it.value.map { entry -> changeEntryToUseBaseCurrency(entry).bind() } }
            .mapValues { it.value.map { entry -> entry.value } }
            .mapValues { it.value.fold(BigDecimal.ZERO, BigDecimal::add) }
            .map { (subcategory, expenseSum) ->
                subcategory?.let { category ->
                    SubcategoryExpenseSumContext(
                        subcategoryId = CommonUtils.objectIdToString(category.id),
                        subcategoryName = category.name,
                        expenseSum = expenseSum
                    )
                } ?: SubcategoryExpenseSumContext(
                    subcategoryId = "",
                    subcategoryName = ""
                )
            }
    }

    private suspend fun changeEntryToUseBaseCurrency(it: EntryDomain): Either<ExchangeRateError, EntryDomain> = either {
        if (it.currency == CurrencyConstants.BASE_CURRENCY) {
            it
        } else {
            it.copy(
                currency = CurrencyConstants.BASE_CURRENCY,
                value = exchangeRateApi.getConvertedAmountForDate(
                    it.date,
                    it.currency to CurrencyConstants.BASE_CURRENCY,
                    it.value
                ).bind()
            )
        }
    }

}
