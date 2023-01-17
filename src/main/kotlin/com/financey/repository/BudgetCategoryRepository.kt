package com.financey.repository

import arrow.core.Either
import arrow.core.Either.Left
import arrow.core.Either.Right
import com.financey.domain.error.DataAccessError
import com.financey.domain.error.ElementDoesNotExistError
import com.financey.domain.error.PersistenceError
import com.financey.domain.model.Budget
import com.financey.domain.model.BudgetCategory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.dao.DataAccessException
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.query.Query
import org.springframework.data.mongodb.core.query.inValues
import org.springframework.data.mongodb.core.query.isEqualTo
import org.springframework.data.mongodb.repository.MongoRepository

interface BudgetCategoryRepository : MongoRepository<Budget, String>, CustomBudgetCategoryRepository

interface CustomBudgetCategoryRepository {
    fun save(budgetCategory: BudgetCategory): Either<Nothing, BudgetCategory>
    fun deleteByIds(ids: List<String>): Either<PersistenceError, Unit>
    fun getAllByUserId(userId: String): Either<PersistenceError, List<BudgetCategory>>
}

class CustomBudgetCategoryRepositoryImpl(
    @Autowired private val mongoTemplate: MongoTemplate
) : CustomBudgetCategoryRepository {

    override fun save(budgetCategory: BudgetCategory): Either<Nothing, BudgetCategory> = Right(mongoTemplate.save(budgetCategory))

    override fun deleteByIds(ids: List<String>): Either<PersistenceError, Unit> {
        val query = Query().addCriteria(BudgetCategory::id inValues ids)
        val existingBudgetCategories = mongoTemplate.find(query, BudgetCategory::class.java)

        return if (existingBudgetCategories.size != ids.size) {
            Left(ElementDoesNotExistError("Budget category with at least one of the specified ids could not be found."))
        } else {
            mongoTemplate.findAllAndRemove(query, BudgetCategory::class.java)
            Right(Unit)
        }
    }

    override fun getAllByUserId(userId: String): Either<PersistenceError, List<BudgetCategory>> {
        val query = Query().addCriteria(BudgetCategory::userId isEqualTo userId)

        return try {
            Right(mongoTemplate.find(query, BudgetCategory::class.java))
        } catch (e: DataAccessException) {
            Left(DataAccessError("There was an issue with accessing database data. Budget categories could not be found."))
        }
    }

}
