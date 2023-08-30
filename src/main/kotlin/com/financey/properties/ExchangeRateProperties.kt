package com.financey.properties

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component

@Component
@ConfigurationProperties(prefix = "exchange-rate")
class ExchangeRateProperties {
    lateinit var baseUrl: String
}
