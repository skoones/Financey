package com.financey.api.mapper

import com.financey.domain.model.EntryDomain
import com.financey.domain.model.InvestmentEntryDomain
import org.mapstruct.Mapper
import org.openapitools.model.EntryDTO
import org.openapitools.model.InvestmentEntryDTO

@Mapper(componentModel = "spring")
abstract class EntryDtoMapper {

    abstract fun fromDto(dto: EntryDTO): EntryDomain

    abstract fun toDto(domain: EntryDomain): EntryDTO

    abstract fun fromInvestmentDto(dto: InvestmentEntryDTO): InvestmentEntryDomain

    abstract fun toInvestmentDto(domain: InvestmentEntryDomain): InvestmentEntryDTO

}
