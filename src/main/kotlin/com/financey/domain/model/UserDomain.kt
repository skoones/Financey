package com.financey.domain.model

data class UserDomain(
    val id: String,
    val password: String,
    val favoriteBudgetIds: List<String>
)
