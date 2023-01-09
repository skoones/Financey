package com.financey.domain.model

import org.bson.types.ObjectId
import org.openapitools.model.EntryCurrency
import org.openapitools.model.EntryType
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.math.BigDecimal
import java.time.LocalDate

@Document
data class Entry(
    @Id val id: ObjectId? = ObjectId.get(),
    val value: BigDecimal,
    val currency: EntryCurrency,
    val name: String,
    val userId: String,
    val budgetId: String?,
    val entryType: EntryType?,
    val date: LocalDate?
)
