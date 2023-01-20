package com.financey.api.mapper

import com.financey.domain.model.Budget
import com.financey.domain.model.BudgetCategory
import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.openapitools.model.BudgetCategoryDTO
import org.openapitools.model.BudgetDTO

@Mapper(componentModel = "spring", uses = [IdMapper::class, EntryDtoMapper::class])
abstract class BudgetDtoMapper {

    @Mapping(target = "id", qualifiedByName = ["IdMapper", "stringToObjectId"])
    abstract fun fromDto(dto: BudgetDTO): Budget

    @Mapping(target = "id", qualifiedByName = ["IdMapper", "objectIdToString"])
    abstract fun toDto(domain: Budget): BudgetDTO

    @Mapping(target = "id", qualifiedByName = ["IdMapper", "stringToObjectId"])
    abstract fun fromCategoryDto(dto: BudgetCategoryDTO): BudgetCategory

    @Mapping(target = "id", qualifiedByName = ["IdMapper", "objectIdToString"])
    abstract fun toCategoryDto(domain: BudgetCategory): BudgetCategoryDTO

}
