package com.financey.domain.db.model

import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document
data class User(
    @Id val id: ObjectId? = ObjectId.get(),
    val username: String,
    val password: String,
    val favoriteBudgetIds: List<String>?
)
