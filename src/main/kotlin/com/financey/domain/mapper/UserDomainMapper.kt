package com.financey.domain.mapper

import com.financey.domain.db.model.User
import com.financey.domain.model.UserDomain
import org.mapstruct.Mapper
import org.mapstruct.Mapping

@Mapper(componentModel = "spring", uses = [IdMapper::class])
abstract class UserDomainMapper {

    @Mapping(target = "id", qualifiedByName = ["IdMapper", "objectIdToString"])
    abstract fun toDomain(document: User): UserDomain

    @Mapping(target = "id", qualifiedByName = ["IdMapper", "stringToObjectId"])
    abstract fun fromDomain(domain: UserDomain): User

}