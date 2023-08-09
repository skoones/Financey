package com.financey.domain.model

import java.math.BigDecimal

data class InvestmentEntryDomain(
    val id: String?,
    val entry: EntryDomain,
    val volume: Int,
    val marketPriceAtOperation: BigDecimal
)