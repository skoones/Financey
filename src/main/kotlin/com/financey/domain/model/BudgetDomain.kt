package com.financey.domain.model

data class BudgetDomain(
    val id: String?,
    val name: String,
    val investment: Boolean,
    val userId: String,
    val categoryId: String?
)
