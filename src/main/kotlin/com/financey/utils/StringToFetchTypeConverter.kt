package com.financey.utils

import org.openapitools.model.FetchType
import org.springframework.core.convert.converter.Converter
import org.springframework.stereotype.Component

@Component
class StringToFetchTypeConverter : Converter<String, FetchType> {
    override fun convert(source: String): FetchType {
        for (enumValue in FetchType.values()) {
            if (enumValue.value == source) {
                return enumValue
            }
        }
        throw IllegalArgumentException("Unexpected value $source")
    }
}
