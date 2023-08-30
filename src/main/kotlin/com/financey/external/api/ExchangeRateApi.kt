package com.financey.external.api

import arrow.core.Either
import com.financey.domain.error.ExchangeRateError
import org.openapitools.model.EntryCurrency
import java.math.BigDecimal
import java.time.LocalDate

interface ExchangeRateApi {

    fun getConvertedAmountForDate(date: LocalDate, pair: Pair<EntryCurrency, EntryCurrency>,
                                  amount: BigDecimal = BigDecimal.ONE):
            Either<ExchangeRateError, BigDecimal>

}
