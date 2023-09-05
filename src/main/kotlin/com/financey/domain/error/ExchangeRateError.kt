package com.financey.domain.error

import org.openapitools.model.EntryCurrency

sealed class ExchangeRateError : FinanceyError()

data class InvalidApiResponse(override val message: String) : ExchangeRateError()

data class RateNotFound(val pair: Pair<EntryCurrency, EntryCurrency>) : ExchangeRateError()
