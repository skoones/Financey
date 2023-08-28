package com.financey.domain.model

data class BudgetCategoryDomain(
    val id: String?,
    val userId: String,
    val name: String,
    val parentCategoryId: String?,
    val investment: Boolean
)
