package com.financey.repository

import arrow.core.Either
import arrow.core.Either.Left
import arrow.core.Either.Right
import com.financey.domain.error.DataAccessError
import com.financey.domain.error.ElementDoesNotExistError
import com.financey.domain.error.MultipleElementsError
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
import org.springframework.transaction.annotation.Transactional

interface BudgetCategoryRepository : MongoRepository<Budget, String>, CustomBudgetCategoryRepository

interface CustomBudgetCategoryRepository {
    fun save(budgetCategory: BudgetCategory): Either<PersistenceError, BudgetCategory>
    fun deleteByIds(ids: List<String>): Either<PersistenceError, Unit>
    fun getAllByUserId(userId: String): Either<PersistenceError, List<BudgetCategory>>
    fun getById(id: String): Either<PersistenceError, BudgetCategory>
    fun getByName(name: String): Either<PersistenceError, BudgetCategory>
}

open class CustomBudgetCategoryRepositoryImpl(
    @Autowired private val mongoTemplate: MongoTemplate
) : CustomBudgetCategoryRepository {

    override fun save(budgetCategory: BudgetCategory): Either<PersistenceError, BudgetCategory> {
        val parentCategory = budgetCategory.parentCategoryId?.let {
            this.getById(it)
        }

        return parentCategory?.fold(
            { Left(it) },
            { saveCategoryAndUpdateParent(budgetCategory, it) }
        ) ?: Right(mongoTemplate.save(budgetCategory))
    }

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

    override fun getById(id: String): Either<PersistenceError, BudgetCategory> {
        val query = Query().addCriteria(BudgetCategory::id isEqualTo id)
        return try {
            val foundResult = mongoTemplate.find(query, BudgetCategory::class.java)
            when (foundResult.size) {
                0 -> Left(ElementDoesNotExistError("There is no category for budget with given id."))
                1 -> Right(foundResult.first())
                else -> Left(MultipleElementsError("There is more than one category for budget with given id in the database."))
            }
        } catch (e: DataAccessException) {
            Left(DataAccessError("There was an issue with accessing database data. Budget category could not be found."))
        }
    }

    override fun getByName(name: String): Either<PersistenceError, BudgetCategory> {
        val query = Query().addCriteria(BudgetCategory::name isEqualTo name)

        return try {
            val existingBudgets = mongoTemplate.find(query, BudgetCategory::class.java)
            when (existingBudgets.size) {
                0 -> Left(ElementDoesNotExistError("There is no category with the given name in the database."))
                1 -> Right(existingBudgets.first())
                else -> Left(MultipleElementsError("Multiple categories with given name have been found."))
            }
        } catch (e: DataAccessException) {
            Left(DataAccessError("There was an issue with accessing database data. Budget categories could not be found."))
        }
    }

    @Transactional
    open fun saveCategoryAndUpdateParent(category: BudgetCategory, parentCategory: BudgetCategory): Either<PersistenceError, BudgetCategory> {
        val parentCategorySubcategories = parentCategory.subcategories
        val newSubcategories = parentCategorySubcategories?.plus(category) ?: listOfNotNull(category)
        this.save(parentCategory.copy(subcategories = newSubcategories))
        return Right(mongoTemplate.save(category))
    }

}
