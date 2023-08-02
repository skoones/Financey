package com.financey.domain.mapper

import org.bson.types.ObjectId
import org.mapstruct.Named
import org.springframework.stereotype.Component

@Named("IdMapper")
@Component
class IdMapper {

    @Named("objectIdToString")
    fun objectIdToString(objectId: ObjectId?): String? = objectId?.toString()

    @Named("stringToObjectId")
    fun stringToObjectId(str: String?): ObjectId? = when (str) {
        null -> null
        else -> ObjectId(str)
    }

}
