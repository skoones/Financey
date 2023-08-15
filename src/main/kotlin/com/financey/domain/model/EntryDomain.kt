package com.financey.domain.model

import org.openapitools.model.EntryCurrency
import org.openapitools.model.EntryType
import java.math.BigDecimal
import java.time.LocalDate

data class EntryDomain(
    val id: String? = null,
    val value: BigDecimal,
    val currency: EntryCurrency,
    val name: String,
    val userId: String,
    val budgetId: String? = null,
    val entryType: EntryType? = EntryType.EXPENSE,
    val date: LocalDate
)
