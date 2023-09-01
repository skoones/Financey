package com.financey.domain.service

import arrow.core.Either
import arrow.core.continuations.either
import com.financey.constants.CurrencyConstants
import com.financey.domain.error.ExchangeRateError
import com.financey.domain.model.EntryDomain
import com.financey.external.api.ExchangeRateApi
import org.springframework.beans.factory.annotation.Autowired

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

}