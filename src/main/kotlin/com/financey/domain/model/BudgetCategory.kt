package com.financey.domain.model

import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document
data class BudgetCategory(
    @Id val id: ObjectId? = ObjectId.get(),
    val userId: String,
    val name: String,
    val subcategories: List<BudgetCategory>?,
    val budgets: List<Budget>?
)
