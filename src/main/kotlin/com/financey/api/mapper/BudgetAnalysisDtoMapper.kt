package com.financey.api.mapper

import com.financey.domain.model.SubcategoryExpenseSumDomain
import org.mapstruct.Mapper
import org.openapitools.model.SubcategoryExpenseSumDTO

@Mapper(componentModel = "spring", uses = [EntryDtoMapper::class])
abstract class BudgetAnalysisDtoMapper {

    abstract fun fromDto(dto: SubcategoryExpenseSumDTO): SubcategoryExpenseSumDomain

    abstract fun toDto(domain: SubcategoryExpenseSumDomain): SubcategoryExpenseSumDTO

}