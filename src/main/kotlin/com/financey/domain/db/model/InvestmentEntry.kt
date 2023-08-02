package com.financey.domain.db.model

import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.math.BigDecimal

@Document
data class InvestmentEntry(
    @Id val id: ObjectId? = ObjectId.get(),
    val entry: Entry,
    val volume: Int,
    val marketPriceAtOperation: BigDecimal
)