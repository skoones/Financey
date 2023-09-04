package com.financey.domain.model

import java.math.BigDecimal

data class SubcategoryExpenseSumDomain(
    val subcategoryId: String?,
    val subcategoryName: String,
    val expenseSum: BigDecimal = BigDecimal.ZERO
)
