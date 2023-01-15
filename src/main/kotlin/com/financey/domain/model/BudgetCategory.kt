package com.financey.domain.model

import org.springframework.data.mongodb.core.mapping.Document

@Document
data class BudgetCategory(
    val userId: String,
    val name: String,
    val subcategories: List<BudgetCategory>?,
    val budgets: List<Budget>?
)
