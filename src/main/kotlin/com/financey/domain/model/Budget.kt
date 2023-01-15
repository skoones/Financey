package com.financey.domain.model

import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document
data class Budget(
    @Id val id: ObjectId? = ObjectId.get(),
    val name: String,
    val investment: Boolean,
    val budgetEntries: List<Entry>?,
    val userId: String
)
