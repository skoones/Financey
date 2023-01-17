package com.financey.domain.context

import org.openapitools.model.EntryCurrency

data class BudgetSumContext(
    val budgetId: String,
    val currency: EntryCurrency
)
