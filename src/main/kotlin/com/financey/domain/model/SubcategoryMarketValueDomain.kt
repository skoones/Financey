package com.financey.domain.model

import java.math.BigDecimal

data class SubcategoryMarketValueDomain(
    val subcategoryId: String?,
    val subcategoryName: String,
    val marketValue: BigDecimal = BigDecimal.ZERO
)