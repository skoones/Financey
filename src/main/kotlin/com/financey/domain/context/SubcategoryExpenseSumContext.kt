package com.financey.domain.context

import java.math.BigDecimal

data class SubcategoryExpenseSumContext(
    val subcategoryId: String?,
    val subcategoryName: String,
    val expenseSum: BigDecimal
)
