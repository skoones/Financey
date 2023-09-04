package com.financey.domain.service

import arrow.core.Either
import arrow.core.continuations.either
import com.financey.domain.error.PersistenceError
import com.financey.domain.mapper.BudgetDomainMapper
import com.financey.domain.model.BudgetDomain
import com.financey.repository.BudgetRepository
import com.financey.repository.UserRepository
import mu.KotlinLogging
import org.openapitools.model.FetchType
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class BudgetService(
    @Autowired private val budgetRepository: BudgetRepository,
    @Autowired private val userRepository: UserRepository,
    @Autowired private val budgetDomainMapper: BudgetDomainMapper
) {
    private val logger = KotlinLogging.logger {}

    suspend fun save(budget: BudgetDomain): Either<PersistenceError, BudgetDomain> = either {
        val savedBudget = budgetRepository.save(budgetDomainMapper.fromDomain(budget)).bind()
        val savedBudgetDomain = budgetDomainMapper.toDomain(savedBudget)
        logger.debug { "Saved $savedBudget to database" }
        savedBudgetDomain
    }

    suspend fun delete(ids: List<String>): Either<PersistenceError, Unit> = either {
        budgetRepository.deleteByIds(ids).bind()
        logger.debug { "Removed budgets with ids $ids from database" }
    }

    suspend fun getAllByUserIdAndFetchType(userId: String, fetchType: FetchType):
            Either<PersistenceError, List<BudgetDomain>> = either {
        val budgets = when (fetchType) {
            FetchType.ALL -> budgetRepository.getAllByUserId(userId).bind()
            FetchType.INVESTMENT_ONLY -> budgetRepository.getAllInvestmentByUserId(userId).bind()
            FetchType.NON_INVESTMENT_ONLY -> budgetRepository.getAllNonInvestmentByUserId(userId).bind()
        }
            .map { budgetDomainMapper.toDomain(it) }
        logger.debug { "Retrieved budgets for user with id $userId" }
        budgets
    }

    suspend fun getAllUncategorizedByUserId(userId: String): Either<PersistenceError, List<BudgetDomain>> = either {
        val budgets = budgetRepository.getAllUncategorizedByUserId(userId).bind()
            .map { budgetDomainMapper.toDomain(it) }
        logger.debug { "Retrieved uncategorized budgets for user with id $userId" }
        budgets
    }

    suspend fun getFavoriteBudgetsByUserId(userId: String): Either<PersistenceError, List<BudgetDomain>> = either {
        val user = userRepository.getById(userId).bind()
        logger.debug { "Retrieved user with id $userId." }
        budgetRepository.getAllByIds(user.favoriteBudgetIds).bind()
            .map { budgetDomainMapper.toDomain(it) }
    }

    suspend fun getByName(name: String, userId: String): Either<PersistenceError, BudgetDomain> = either {
        val budget = budgetRepository.getByName(name, userId).bind()
        val budgetDomain = budgetDomainMapper.toDomain(budget)
        logger.debug { "Retrieved budget with name ${name}." }
        budgetDomain
    }

    suspend fun getAllByCategoryId(categoryId: String): Either<PersistenceError, List<BudgetDomain>> = either  {
        val budgets = budgetRepository.getAllByCategoryId(categoryId).bind()
            .map { budgetDomainMapper.toDomain(it) }
        logger.debug { "Retrieved budgets with category id ${categoryId}." }
        budgets
    }

    suspend fun getById(budgetId: String): Either<PersistenceError, BudgetDomain> = either {
        val budget = budgetRepository.getById(budgetId).bind()
        val budgetDomain = budgetDomainMapper.toDomain(budget)
        logger.debug { "Retrieved budget with id ${budgetId}." }
        budgetDomain
    }

}
