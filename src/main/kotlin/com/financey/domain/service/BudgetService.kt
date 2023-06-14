package com.financey.domain.service

import arrow.core.Either
import arrow.core.continuations.either
import com.financey.domain.context.BudgetSumContext
import com.financey.domain.error.FinanceyError
import com.financey.domain.error.PersistenceError
import com.financey.domain.model.Budget
import com.financey.repository.BudgetRepository
import com.financey.repository.UserRepository
import mu.KotlinLogging
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.math.BigDecimal

@Service
class BudgetService(
    @Autowired private val budgetRepository: BudgetRepository,
    @Autowired private val userRepository: UserRepository
) {
    private val logger = KotlinLogging.logger {}

    suspend fun save(budget: Budget): Either<PersistenceError, Budget> = either {
        val savedBudget = budgetRepository.save(budget).bind()
        logger.debug { "Saved $savedBudget to database" }
        savedBudget
    }

    suspend fun delete(ids: List<String>): Either<PersistenceError, Unit> = either {
        budgetRepository.deleteByIds(ids).bind()
        logger.debug { "Removed budgets with ids $ids from database" }
    }

    suspend fun getAllByUserId(userId: String): Either<PersistenceError, List<Budget>> = either {
        val budgets = budgetRepository.getAllByUserId(userId).bind()
        logger.debug { "Retrieved budgets for user with id $userId" }
        budgets
    }

    suspend fun getAllUncategorizedByUserId(userId: String): Either<PersistenceError, List<Budget>> = either {
        val budgets = budgetRepository.getAllUncategorizedByUserId(userId).bind()
        logger.debug { "Retrieved uncategorized budgets for user with id $userId" }
        budgets
    }

    suspend fun getFavoriteBudgetsByUserId(userId: String): Either<PersistenceError, List<Budget>> = either {
        val user = userRepository.getById(userId).bind()
        logger.debug { "Retrieved user with id $userId." }
        budgetRepository.getAllByIds(user.favoriteBudgetIds).bind()
    }

    suspend fun getByName(name: String, userId: String): Either<PersistenceError, Budget> = either {
        val budget = budgetRepository.getByName(name, userId).bind()
        logger.debug { "Retrieved budget with name ${name}." }
        budget
    }

    suspend fun getAllByCategoryId(categoryId: String): Either<PersistenceError, List<Budget>> = either  {
        val budget = budgetRepository.getAllByCategoryId(categoryId).bind()
        logger.debug { "Retrieved budgets with category id ${categoryId}." }
        budget
    }

}
