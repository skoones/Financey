package com.financey.domain.mapper

import com.financey.domain.db.model.Entry
import com.financey.domain.db.model.InvestmentEntry
import com.financey.domain.model.EntryDomain
import com.financey.domain.model.InvestmentEntryDomain
import org.mapstruct.Mapper
import org.mapstruct.Mapping




@Mapper(componentModel = "spring", uses = [IdMapper::class])
abstract class EntryDomainMapper {

    @Mapping(target = "id", qualifiedByName = ["IdMapper", "objectIdToString"])
    abstract fun toDomain(document: Entry): EntryDomain

    @Mapping(target = "id", qualifiedByName = ["IdMapper", "stringToObjectId"])
    abstract fun fromDomain(domain: EntryDomain): Entry

    @Mapping(target = "id", qualifiedByName = ["IdMapper", "objectIdToString"])
    abstract fun toInvestmentDomain(document: InvestmentEntry): InvestmentEntryDomain

    @Mapping(target = "id", qualifiedByName = ["IdMapper", "stringToObjectId"])
    abstract fun fromInvestmentDomain(domain: InvestmentEntryDomain): InvestmentEntry

}
