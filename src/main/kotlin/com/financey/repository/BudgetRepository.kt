package com.financey.repository

import arrow.core.Either
import arrow.core.Either.Left
import arrow.core.Either.Right
import com.financey.domain.error.DataAccessError
import com.financey.domain.error.ElementDoesNotExistError
import com.financey.domain.error.PersistenceError
import com.financey.domain.model.Budget
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.dao.DataAccessException
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.query.Query
import org.springframework.data.mongodb.core.query.inValues
import org.springframework.data.mongodb.core.query.isEqualTo
import org.springframework.data.mongodb.repository.MongoRepository

interface BudgetRepository : MongoRepository<Budget, String>, CustomBudgetRepository

interface CustomBudgetRepository {
    fun save(budget: Budget): Either<Nothing, Budget>
    fun deleteByIds(ids: List<String>): Either<PersistenceError, Unit>
    fun getAllByUserId(userId: String): Either<PersistenceError, List<Budget>>
    fun getAllByIds(ids: List<String>): Either<PersistenceError, List<Budget>>
}

class CustomBudgetRepositoryImpl(
    @Autowired private val mongoTemplate: MongoTemplate
) : CustomBudgetRepository {

    override fun save(budget: Budget): Either<Nothing, Budget> = Right(mongoTemplate.save(budget))

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

}
