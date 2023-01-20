package com.financey.domain.service

import arrow.core.Either
import arrow.core.continuations.either
import com.financey.domain.error.PersistenceError
import com.financey.domain.model.BudgetCategory
import com.financey.repository.BudgetCategoryRepository
import mu.KLogger
import mu.KotlinLogging
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class BudgetCategoryService(
    @Autowired private val budgetCategoryRepository: BudgetCategoryRepository
) {

    private val logger: KLogger = KotlinLogging.logger {}

    suspend fun getAllCategoriesByUserId(userId: String): Either<PersistenceError, List<BudgetCategory>> = either {
        val categories = budgetCategoryRepository.getAllByUserId(userId).bind()
        logger.debug { "Retrieved budget categories for user with id $userId"}
        categories
    }

    suspend fun save(category: BudgetCategory): Either<Nothing, BudgetCategory> = either {
        val savedCategory = budgetCategoryRepository.save(category).bind()
        logger.debug ("Saved $savedCategory to database")
        savedCategory
    }

    suspend fun delete(categoryIds: List<String>): Either<PersistenceError, Unit> = either {
        budgetCategoryRepository.deleteByIds(categoryIds).bind()
        logger.debug { "Removed budget categories with ids $categoryIds from database" }
    }


}
