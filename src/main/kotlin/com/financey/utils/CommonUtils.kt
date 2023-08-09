package com.financey.utils

import org.bson.types.ObjectId

object CommonUtils {

    fun objectIdToString(objectId: ObjectId?) = objectId?.toHexString() ?: ""

}