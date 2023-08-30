package com.financey.domain.error

sealed class ExchangeRateError : FinanceyError()

data class InvalidApiResponse(override val message: String) : ExchangeRateError()

data class RateNotFound(val pair: Pair<String, String>) : ExchangeRateError()
