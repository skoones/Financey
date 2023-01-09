package com.financey.api.mapper

import com.financey.domain.model.Entry
import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.openapitools.model.EntryDTO

@Mapper(componentModel = "spring", uses = [IdMapper::class])
abstract class EntryDtoMapper {

    @Mapping(target = "id", qualifiedByName = ["IdMapper", "stringToObjectId"])
    abstract fun fromDto(dto: EntryDTO): Entry

    @Mapping(target = "id", qualifiedByName = ["IdMapper", "objectIdToString"])
    abstract fun toDto(domain: Entry): EntryDTO

}
