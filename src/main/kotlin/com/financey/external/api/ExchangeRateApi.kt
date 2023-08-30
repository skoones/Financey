package com.financey.external.api

import arrow.core.Either
import com.financey.domain.error.ExchangeRateError

interface ExchangeRateApi {

    fun fetchHistoricalRates(date: String, currencyPairs: List<Pair<String, String>>):
            Map<Pair<String, String>, Either<ExchangeRateError, Double>>

}
