package com.financey.domain.service

import arrow.core.Either
import arrow.core.continuations.either
import com.financey.domain.error.PersistenceError
import com.financey.domain.model.Budget
import com.financey.repository.BudgetRepository
import mu.KotlinLogging
import org.springframework.stereotype.Service

@Service
class BudgetService(
    private val budgetRepository: BudgetRepository
) {
    private val logger = KotlinLogging.logger {}

    suspend fun save(budget: Budget): Either<Nothing, Budget> = either {
       val savedBudget = budgetRepository.save(budget).bind()
       logger.debug ("Saved $savedBudget to database")
       savedBudget
    }

    suspend fun delete(ids: List<String>): Either<PersistenceError, Unit> = either {
        budgetRepository.deleteByIds(ids).bind()
        logger.debug { "Removed entries with ids $ids from database" }
    }

    suspend fun getAllByUserId(userId: String): Either<PersistenceError, List<Budget>> = either {
        val budgets = budgetRepository.getAllByUserId(userId).bind()
        logger.debug { "Retrieved budgets for user with id $userId"}
        budgets
    }

}
