package com.financey.api.mapper

import com.financey.domain.model.SubcategoryMarketValueDomain
import org.mapstruct.Mapper
import org.openapitools.model.SubcategoryMarketValueDTO

@Mapper(componentModel = "spring", uses = [EntryDtoMapper::class])
abstract class InvestmentAnalysisDtoMapper {

    abstract fun fromDto(dto: SubcategoryMarketValueDTO): SubcategoryMarketValueDomain

    abstract fun toDto(domain: SubcategoryMarketValueDomain): SubcategoryMarketValueDTO

}