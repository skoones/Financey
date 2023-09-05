package com.financey.domain.model

import java.math.BigDecimal
import java.time.LocalDate

data class InvestmentEntryDomain(
    val id: String?,
    val entry: EntryDomain,
    val volume: Int,
    val marketPriceAtOperation: BigDecimal,
    val datesToMarketPrices: Map<LocalDate, BigDecimal> = mapOf(entry.date to marketPriceAtOperation)
)
