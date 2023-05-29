package com.financey.api.mapper

import com.financey.domain.model.Entry
import com.financey.domain.model.InvestmentEntry
import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.openapitools.model.EntryDTO
import org.openapitools.model.InvestmentEntryDTO

@Mapper(componentModel = "spring", uses = [IdMapper::class])
abstract class EntryDtoMapper {

    @Mapping(target = "id", qualifiedByName = ["IdMapper", "stringToObjectId"])
    abstract fun fromDto(dto: EntryDTO): Entry

    @Mapping(target = "id", qualifiedByName = ["IdMapper", "objectIdToString"])
    abstract fun toDto(domain: Entry): EntryDTO

    abstract fun fromInvestmentDto(dto: InvestmentEntryDTO): InvestmentEntry

    abstract fun toInvestmentDto(domain: InvestmentEntry): InvestmentEntryDTO

}
