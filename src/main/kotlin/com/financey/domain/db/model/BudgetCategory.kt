package com.financey.domain.db.model

import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document
data class BudgetCategory(
    @Id val id: ObjectId? = ObjectId.get(),
    val userId: String,
    val name: String,
    val parentCategoryId: String?,
    val ancestorCategoryIds: List<String>?,
    val investment: Boolean
)
