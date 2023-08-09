package com.financey.domain.db.model

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document
data class User(
    @Id val id: String,
    val password: String,
    val favoriteBudgetIds: List<String>
)
