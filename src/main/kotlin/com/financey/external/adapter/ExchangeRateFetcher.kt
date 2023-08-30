package com.financey.external.adapter

import arrow.core.Either
import com.financey.domain.error.ExchangeRateError
import com.financey.domain.error.InvalidApiResponse
import com.financey.domain.error.RateNotFound
import com.financey.external.api.ExchangeRateApi
import com.financey.properties.ExchangeRateProperties
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate

data class ExchangeRateResponse(
    val rates: Map<String, Double>
)

@Service
class ExchangeRateFetcher(
    @Autowired private val properties: ExchangeRateProperties
) : ExchangeRateApi {

    private val restTemplate = RestTemplate()

    override fun fetchHistoricalRates(date: String, currencyPairs: List<Pair<String, String>>):
            Map<Pair<String, String>, Either<ExchangeRateError, Double>> {
        return currencyPairs.associateWith { pair ->
            fetchRateForPair(date, pair)
        }
    }

    private fun fetchRateForPair(date: String, pair: Pair<String, String>): Either<ExchangeRateError, Double> {
        val (baseCurrency, targetCurrency) = pair
        val urlString = "${properties.baseUrl}/$date?base=$baseCurrency&symbols=$targetCurrency"

        val response: ExchangeRateResponse? = restTemplate.getForObject(urlString, ExchangeRateResponse::class.java)

        return if (response != null) {
            response.rates[targetCurrency]?.let { rate ->
                Either.Right(rate)
            } ?: Either.Left(RateNotFound(pair))
        } else {
            Either.Left(InvalidApiResponse("Invalid API response for $pair on $date"))
        }
    }

}
