package com.financey.api.mapper

import com.financey.domain.context.SubcategoryExpenseSumContext
import org.mapstruct.Mapper
import org.openapitools.model.SubcategoryExpenseSumDTO

@Mapper(componentModel = "spring", uses = [EntryDtoMapper::class])
abstract class BudgetAnalysisDtoMapper {

    abstract fun fromDto(dto: SubcategoryExpenseSumDTO): SubcategoryExpenseSumContext

    abstract fun toDto(context: SubcategoryExpenseSumContext): SubcategoryExpenseSumDTO

}