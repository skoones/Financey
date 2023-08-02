package com.financey.repository

import arrow.core.Either
import arrow.core.Either.Left
import arrow.core.Either.Right
import com.financey.domain.db.model.Budget
import com.financey.domain.error.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.dao.DataAccessException
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.query.Criteria
import org.springframework.data.mongodb.core.query.Query
import org.springframework.data.mongodb.core.query.inValues
import org.springframework.data.mongodb.core.query.isEqualTo
import org.springframework.data.mongodb.repository.MongoRepository

interface BudgetRepository : MongoRepository<Budget, String>, CustomBudgetRepository

interface CustomBudgetRepository {
    fun save(budget: Budget): Either<PersistenceError, Budget>
    fun deleteByIds(ids: List<String>): Either<PersistenceError, Unit>
    fun getAllByUserId(userId: String): Either<PersistenceError, List<Budget>>
    fun getAllByIds(ids: List<String>): Either<PersistenceError, List<Budget>>

    fun getById(id: String): Either<PersistenceError, Budget>
    fun getAllUncategorizedByUserId(userId: String): Either<PersistenceError, List<Budget>>
    fun getAllByCategoryId(categoryId: String): Either<PersistenceError, List<Budget>>
    fun getByName(name: String, userId: String): Either<PersistenceError, Budget>
}

open class CustomBudgetRepositoryImpl(
    @Autowired private val categoryRepository: BudgetCategoryRepository,
    @Autowired private val mongoTemplate: MongoTemplate
) : CustomBudgetRepository {

    override fun save(budget: Budget): Either<PersistenceError, Budget> {
        val category = budget.categoryId?.let {
            categoryRepository.getById(it)
        }

        return category?.fold(
            { Left(it) },
            { saveWithUniqueName(budget) }
        ) ?: saveWithUniqueName(budget)
    }

    override fun deleteByIds(ids: List<String>): Either<PersistenceError, Unit> {
        val query = Query().addCriteria(Budget::id inValues ids)
        val existingBudgets = mongoTemplate.find(query, Budget::class.java)

        return if (existingBudgets.size != ids.size) {
            Left(ElementDoesNotExistError("Budget with at least one of the specified ids could not be found."))
        } else {
            mongoTemplate.findAllAndRemove(query, Budget::class.java)
            Right(Unit)
        }
    }

    override fun getAllByUserId(userId: String): Either<PersistenceError, List<Budget>> {
        val query = Query().addCriteria(Budget::userId isEqualTo userId)

        return try {
            Right(mongoTemplate.find(query, Budget::class.java))
        } catch (e: DataAccessException) {
            Left(DataAccessError("There was an issue with accessing database data. Budgets could not be found."))
        }
    }

    override fun getAllByIds(ids: List<String>): Either<PersistenceError, List<Budget>> {
        val query = Query().addCriteria(Budget::id inValues ids)

        return try {
            Right(mongoTemplate.find(query, Budget::class.java))
        } catch (e: DataAccessException) {
            Left(DataAccessError("There was an issue with accessing database data. Budgets could not be found."))
        }
    }

    override fun getById(id: String): Either<PersistenceError, Budget> {
        val query = Query().addCriteria(Budget::id isEqualTo id)

        return try {
            val existingBudgets = mongoTemplate.find(query, Budget::class.java)
            when (existingBudgets.size) {
                0 -> Left(ElementDoesNotExistError("There is no budget with the given id in the database."))
                1 -> Right(existingBudgets.first())
                else -> Left(MultipleElementsError("Multiple budgets with given id have been found."))
            }
        } catch (e: DataAccessException) {
            Left(DataAccessError("There was an issue with accessing database data. Budgets could not be found."))
        }
    }

    override fun getByName(name: String, userId: String): Either<PersistenceError, Budget> {
        val query = Query()
            .addCriteria(Budget::name isEqualTo name)
            .addCriteria(Budget::userId isEqualTo userId)

        return try {
            val existingBudgets = mongoTemplate.find(query, Budget::class.java)
            when (existingBudgets.size) {
                0 -> Left(ElementDoesNotExistError("There is no budget with the given name in the database."))
                1 -> Right(existingBudgets.first())
                else -> Left(MultipleElementsError("Multiple budgets with given name have been found."))
            }
        } catch (e: DataAccessException) {
            Left(DataAccessError("There was an issue with accessing database data. Budgets could not be found."))
        }
    }

    override fun getAllUncategorizedByUserId(userId: String): Either<PersistenceError, List<Budget>> {
        val query = Query()
            .addCriteria(Budget::userId isEqualTo userId)
            .addCriteria(Criteria.where("categoryId").isNull)

        return try {
            Right(mongoTemplate.find(query, Budget::class.java))
        } catch (e: DataAccessException) {
            Left(DataAccessError("There was an issue with accessing database data. Budgets could not be found."))
        }
    }

    override fun getAllByCategoryId(categoryId: String): Either<PersistenceError, List<Budget>> {
        val query = Query().addCriteria(Budget::categoryId isEqualTo categoryId)

        return try {
            Right(mongoTemplate.find(query, Budget::class.java))
        } catch (e: DataAccessException) {
            Left(DataAccessError("There was an issue with accessing database data. Budgets could not be found."))
        }
    }

    private fun saveWithUniqueName(budget: Budget) = getByName(budget.name, budget.userId)
        .fold({ e ->
            when (e) {
                is ElementDoesNotExistError -> Right(mongoTemplate.save(budget))
                else -> Left(e)
            }
        },
            {
                if (it.id != budget.id) Left(UniqueElementExistsError("Budget with given name already exists for this user."))
                else Right(mongoTemplate.save(budget))
            })

}
