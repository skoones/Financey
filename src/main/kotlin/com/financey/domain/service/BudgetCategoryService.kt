package com.financey.domain.service

import arrow.core.Either
import arrow.core.continuations.either
import com.financey.domain.error.PersistenceError
import com.financey.domain.mapper.BudgetDomainMapper
import com.financey.domain.model.BudgetCategoryDomain
import com.financey.repository.BudgetCategoryRepository
import mu.KLogger
import mu.KotlinLogging
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class BudgetCategoryService(
    @Autowired private val budgetCategoryRepository: BudgetCategoryRepository,
    @Autowired private val budgetDomainMapper: BudgetDomainMapper
) {

    private val logger: KLogger = KotlinLogging.logger {}

    suspend fun getAllCategoriesByUserId(userId: String): Either<PersistenceError, List<BudgetCategoryDomain>> = either {
        val categories = budgetCategoryRepository.getAllByUserId(userId).bind()
            .map { budgetDomainMapper.toCategoryDomain(it) }
        logger.debug { "Retrieved budget categories for user with id $userId"}
        categories
    }

    suspend fun save(category: BudgetCategoryDomain): Either<PersistenceError, BudgetCategoryDomain> = either {
        val savedCategory = budgetCategoryRepository.save(budgetDomainMapper.fromCategoryDomain(category)).bind()
        val savedCategoryDomain = budgetDomainMapper.toCategoryDomain(savedCategory)
        logger.debug ("Saved $savedCategory to database")
        savedCategoryDomain
    }

    suspend fun delete(categoryIds: List<String>): Either<PersistenceError, Unit> = either {
        budgetCategoryRepository.deleteByIds(categoryIds).bind()
        logger.debug { "Removed budget categories with ids $categoryIds from database" }
    }

    suspend fun getByName(name: String): Either<PersistenceError, BudgetCategoryDomain> = either {
        val category = budgetCategoryRepository.getByName(name).bind()
        val budgetCategoryDomain = budgetDomainMapper.toCategoryDomain(category)
        logger.debug { "Retrieved budget with name ${name}." }
        budgetCategoryDomain
    }

    suspend fun getAllByParentId(parentId: String): Either<PersistenceError, List<BudgetCategoryDomain>> = either {
        val categories = budgetCategoryRepository.getAllByParentId(parentId).bind()
            .map { budgetDomainMapper.toCategoryDomain(it) }
        logger.debug { "Retrieved budget categories with parent id $parentId"}
        categories
    }

    suspend fun getById(id: String): Either<PersistenceError, BudgetCategoryDomain> = either {
        val budgetCategory = budgetCategoryRepository.getById(id).bind()
        val budgetCategoryDomain = budgetDomainMapper.toCategoryDomain(budgetCategory)
        logger.debug { "Retrieved budget category with id ${id}." }
        budgetCategoryDomain
    }

}
