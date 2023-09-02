package com.financey.domain.service

import arrow.core.Either
import arrow.core.continuations.either
import com.financey.constants.CurrencyConstants
import com.financey.domain.error.ExchangeRateError
import com.financey.domain.model.EntryDomain
import com.financey.external.api.ExchangeRateApi
import org.openapitools.model.EntryCurrency
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.time.LocalDate

@Service
class CurrencyService(
    @Autowired private val exchangeRateApi: ExchangeRateApi
) {

    suspend fun changeEntryToUseBaseCurrency(entry: EntryDomain): Either<ExchangeRateError, EntryDomain> = either {
        if (entry.currency == CurrencyConstants.BASE_CURRENCY) {
            entry
        } else {
            entry.copy(
                currency = CurrencyConstants.BASE_CURRENCY,
                value = exchangeRateApi.getConvertedAmountForDate(
                    entry.date,
                    entry.currency to CurrencyConstants.BASE_CURRENCY,
                    entry.value
                ).bind()
            )
        }
    }

    suspend fun exchange(sourceToTargetCurrency: Pair<EntryCurrency, EntryCurrency>,
                         amount: BigDecimal, date: LocalDate) = either {
        exchangeRateApi.getConvertedAmountForDate(date, sourceToTargetCurrency, amount).bind()
    }

}