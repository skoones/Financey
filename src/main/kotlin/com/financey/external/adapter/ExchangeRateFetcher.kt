package com.financey.external.adapter

import arrow.core.Either
import com.financey.constants.CurrencyConstants
import com.financey.domain.error.ExchangeRateError
import com.financey.domain.error.InvalidApiResponse
import com.financey.domain.error.RateNotFound
import com.financey.external.api.ExchangeRateApi
import com.financey.properties.ExchangeRateProperties
import org.openapitools.model.EntryCurrency
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate
import java.math.BigDecimal
import java.time.LocalDate

data class ExchangeRateResponse(
    val rates: Map<EntryCurrency, Double>
)

@Service
class ExchangeRateFetcher(
    @Autowired private val properties: ExchangeRateProperties
) : ExchangeRateApi {

    private val restTemplate = RestTemplate()

    override fun getConvertedAmountForDate(date: LocalDate, pair: Pair<EntryCurrency, EntryCurrency>,
                                           amount: BigDecimal):
            Either<ExchangeRateError, BigDecimal> {
        val (baseCurrency, targetCurrency) = pair
        val urlString = "${properties.baseUrl}/$date?base=$baseCurrency&symbols=$targetCurrency&amount=$amount" +
                "&places=${CurrencyConstants.DEFAULT_DECIMAL_PLACES}"

        val response: ExchangeRateResponse? = restTemplate.getForObject(urlString, ExchangeRateResponse::class.java)

        return if (response != null) {
            response.rates[targetCurrency]
                ?.let { rate -> Either.Right(BigDecimal.valueOf(rate)) } ?: Either.Left(RateNotFound(pair))
        } else {
            Either.Left(InvalidApiResponse("Invalid API response for $pair on $date"))
        }
    }

}
