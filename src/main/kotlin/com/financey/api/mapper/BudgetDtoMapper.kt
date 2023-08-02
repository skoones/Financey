package com.financey.api.mapper

import com.financey.domain.model.BudgetCategoryDomain
import com.financey.domain.model.BudgetDomain
import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.openapitools.model.BudgetCategoryDTO
import org.openapitools.model.BudgetDTO

@Mapper(componentModel = "spring", uses = [EntryDtoMapper::class])
abstract class BudgetDtoMapper {

    abstract fun fromDto(dto: BudgetDTO): BudgetDomain

    abstract fun toDto(domain: BudgetDomain): BudgetDTO

    abstract fun fromCategoryDto(dto: BudgetCategoryDTO): BudgetCategoryDomain

    @Mapping(target = "subcategories", ignore = true)
    @Mapping(target = "budgets", ignore = true)
    abstract fun toCategoryDto(domain: BudgetCategoryDomain): BudgetCategoryDTO

}
