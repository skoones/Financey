package com.financey.api.mapper

import com.financey.domain.model.UserDomain
import org.mapstruct.Mapper
import org.openapitools.model.UserDTO

@Mapper(componentModel = "spring", uses = [EntryDtoMapper::class])
abstract class UserDtoMapper {

    abstract fun fromDto(dto: UserDTO): UserDomain

    abstract fun toDto(domain: UserDomain): UserDTO

}