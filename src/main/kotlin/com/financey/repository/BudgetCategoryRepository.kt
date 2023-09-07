package com.financey.repository

import arrow.core.Either
import arrow.core.Either.Left
import arrow.core.Either.Right
import com.financey.domain.db.model.Budget
import com.financey.domain.db.model.BudgetCategory
import com.financey.domain.error.DataAccessError
import com.financey.domain.error.ElementDoesNotExistError
import com.financey.domain.error.MultipleElementsError
import com.financey.domain.error.PersistenceError
import com.financey.utils.CommonUtils.objectIdToString
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.dao.DataAccessException
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.query.Query
import org.springframework.data.mongodb.core.query.inValues
import org.springframework.data.mongodb.core.query.isEqualTo
import org.springframework.data.mongodb.repository.MongoRepository

interface BudgetCategoryRepository : MongoRepository<Budget, String>, CustomBudgetCategoryRepository

interface CustomBudgetCategoryRepository {
    fun save(budgetCategory: BudgetCategory): Either<PersistenceError, BudgetCategory>
    fun deleteByIds(ids: List<String>): Either<PersistenceError, Unit>
    fun getAllByUserId(userId: String): Either<PersistenceError, List<BudgetCategory>>
    fun getAllInvestmentByUserId(userId: String): Either<PersistenceError, List<BudgetCategory>>
    fun getAllNonInvestmentByUserId(userId: String): Either<PersistenceError, List<BudgetCategory>>
    fun getById(id: String): Either<PersistenceError, BudgetCategory>
    fun getByNameAndUserId(name: String, userId: String): Either<PersistenceError, BudgetCategory>
    fun getAllByParentId(parentId: String): Either<PersistenceError, List<BudgetCategory>>
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
            { parent -> saveCategoryWithAncestors(budgetCategory, parent) }
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

    override fun getAllInvestmentByUserId(userId: String): Either<PersistenceError, List<BudgetCategory>> {
        val query = Query().addCriteria(BudgetCategory::userId isEqualTo userId)
            .addCriteria(BudgetCategory::investment isEqualTo true)

        return try {
            Right(mongoTemplate.find(query, BudgetCategory::class.java))
        } catch (e: DataAccessException) {
            Left(DataAccessError("There was an issue with accessing database data. Budget categories could not be found."))
        }
    }

    override fun getAllNonInvestmentByUserId(userId: String): Either<PersistenceError, List<BudgetCategory>> {
        val query = Query().addCriteria(BudgetCategory::userId isEqualTo userId)
            .addCriteria(BudgetCategory::investment isEqualTo false)

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
                0 -> Left(ElementDoesNotExistError("There is no budget category with given id."))
                1 -> Right(foundResult.first())
                else -> Left(MultipleElementsError("There is more than one budget category with given id in the database."))
            }
        } catch (e: DataAccessException) {
            Left(DataAccessError("There was an issue with accessing database data. Budget category could not be found."))
        }
    }

    override fun getByNameAndUserId(name: String, userId: String): Either<PersistenceError, BudgetCategory> {
        val query = Query().addCriteria(BudgetCategory::name isEqualTo name)
            .addCriteria(BudgetCategory::userId isEqualTo userId)

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

    override fun getAllByParentId(parentId: String): Either<PersistenceError, List<BudgetCategory>> {
        val query = Query().addCriteria(BudgetCategory::parentCategoryId isEqualTo parentId)

        return try {
            Right(mongoTemplate.find(query, BudgetCategory::class.java))
        } catch (e: DataAccessException) {
            Left(DataAccessError("There was an issue with accessing database data. Budget categories could not be found."))
        }
    }

    private fun saveCategoryWithAncestors(
        budgetCategory: BudgetCategory,
        parent: BudgetCategory
    ): Right<BudgetCategory> {
        val parentId = objectIdToString(parent.id)

        return Right(
            mongoTemplate.save(
                budgetCategory.copy(
                    ancestorCategoryIds =
                    parent.ancestorCategoryIds?.plus(parentId) ?: listOf(parentId)
                )
            )
        )
    }

}
