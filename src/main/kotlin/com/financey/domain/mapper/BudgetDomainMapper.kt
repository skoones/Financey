package com.financey.domain.mapper

import com.financey.domain.db.model.Budget
import com.financey.domain.db.model.BudgetCategory
import com.financey.domain.model.BudgetCategoryDomain
import com.financey.domain.model.BudgetDomain
import org.mapstruct.Mapper
import org.mapstruct.Mapping

@Mapper(componentModel = "spring", uses = [IdMapper::class, EntryDomainMapper::class])
abstract class BudgetDomainMapper {

    @Mapping(target = "id", qualifiedByName = ["IdMapper", "objectIdToString"])
    abstract fun toDomain(document: Budget): BudgetDomain

    @Mapping(target = "id", qualifiedByName = ["IdMapper", "stringToObjectId"])
    @Mapping(target = "ancestorCategoryIds", ignore = true)
    abstract fun fromDomain(domain: BudgetDomain): Budget

    @Mapping(target = "id", qualifiedByName = ["IdMapper", "objectIdToString"])
    abstract fun toCategoryDomain(document: BudgetCategory): BudgetCategoryDomain

    @Mapping(target = "id", qualifiedByName = ["IdMapper", "stringToObjectId"])
    @Mapping(target = "ancestorCategoryIds", ignore = true)
    abstract fun fromCategoryDomain(domain: BudgetCategoryDomain): BudgetCategory

}
