package com.financey.api.controller

import com.financey.api.mapper.BudgetDtoMapper
import com.financey.domain.context.BudgetSumContext
import com.financey.domain.service.BudgetCategoryService
import com.financey.domain.service.BudgetService
import kotlinx.coroutines.runBlocking
import org.openapitools.api.BudgetApi
import org.openapitools.model.BudgetCategoryDTO
import org.openapitools.model.BudgetDTO
import org.openapitools.model.EntryCurrency
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.RestController
import java.math.BigDecimal

@RestController
@CrossOrigin
class BudgetController(
    @Autowired private val budgetService: BudgetService,
    @Autowired private val budgetCategoryService: BudgetCategoryService,
    @Autowired private val budgetDtoMapper: BudgetDtoMapper
) : BudgetApi {

    override fun addBudget(budgetDTO: BudgetDTO): ResponseEntity<String> {
        val budget = budgetDtoMapper.fromDto(budgetDTO)
        val budgetResult = runBlocking {
            budgetService.save(budget)
        }

        return budgetResult.fold(
            { throw it },
            { ResponseEntity.ok("Budget saved with id ${it.id}.")  }
        )
    }

    override fun deleteBudgetsByIds(budgetIds: List<String>): ResponseEntity<String> {
        val deletionResult = runBlocking {
            budgetService.delete(budgetIds)
        }

        return deletionResult.fold(
            { throw it },
            { ResponseEntity.ok("Budgets with given ids have been deleted") }
        )
    }

    override fun updateBudget(budgetDTO: BudgetDTO): ResponseEntity<String> {
        val budget = budgetDtoMapper.fromDto(budgetDTO)
        runBlocking {
            budgetService.save(budget)
        }

        return ResponseEntity.ok("Updated budget with id ${budget.id}.")
    }

    override fun getUncategorizedBudgets(userId: String): ResponseEntity<List<BudgetDTO>> {
        val budgetsResult = runBlocking {
            budgetService.getAllUncategorizedByUserId(userId)
        }

        return budgetsResult.fold(
            { throw it },
            { budgets -> ResponseEntity.ok(budgets.map { budgetDtoMapper.toDto(it) })}
        )
    }

    override fun getBudgetFavorites(userId: String): ResponseEntity<List<BudgetDTO>> {
        val userFavoriteBudgets = runBlocking {
            budgetService.getFavoriteBudgetsByUserId(userId)
        }

        return userFavoriteBudgets.fold(
            { throw it },
            { budgets -> ResponseEntity.ok(budgets.map { budgetDtoMapper.toDto(it) })}
        )
    }

    override fun getByName(name: String, userId: String): ResponseEntity<BudgetDTO> {
        val budgetResult = runBlocking {
            budgetService.getByName(name)
        }

        return budgetResult.fold(
            { throw it },
            { budget -> ResponseEntity.ok(budgetDtoMapper.toDto(budget))}
        )
    }

    override fun getBudgetSum(userId: String, budgetId: String, currency: EntryCurrency): ResponseEntity<BigDecimal> {
        val budgetSumContext = BudgetSumContext(budgetId, currency)
        val sumResult = runBlocking {
            budgetService.findBudgetSum(userId, budgetSumContext)
        }

        return sumResult.fold(
            { throw it },
            { ResponseEntity.ok(it) }
        )
    }

    override fun getCategories(userId: String): ResponseEntity<List<BudgetCategoryDTO>> {
       val categoriesResult = runBlocking {
           budgetCategoryService.getAllCategoriesByUserId(userId)
       }

        return categoriesResult.fold(
            { throw it },
            { categories -> ResponseEntity.ok(categories.map { budgetDtoMapper.toCategoryDto(it) })}
        )
    }

    override fun addCategory(budgetCategoryDTO: BudgetCategoryDTO): ResponseEntity<String> {
        val category = budgetDtoMapper.fromCategoryDto(budgetCategoryDTO)
        val categoryResult = runBlocking {
            budgetCategoryService.save(category)
        }

        return categoryResult.fold(
            { throw it },
            { ResponseEntity.ok("Budget category saved with id ${it.id}.")  }
        )
    }

    override fun getCategoryByName(name: String, userId: String): ResponseEntity<BudgetCategoryDTO> {
        val categoryResult = runBlocking {
            budgetCategoryService.getByName(name)
        }

        return categoryResult.fold(
            { throw it },
            { ResponseEntity.ok(budgetDtoMapper.toCategoryDto(it)) }
        )
    }

    override fun updateBudgetCategory(budgetCategoryDTO: BudgetCategoryDTO): ResponseEntity<String> {
        val category = budgetDtoMapper.fromCategoryDto(budgetCategoryDTO)
        runBlocking {
            budgetCategoryService.save(category)
        }

        return ResponseEntity.ok("Updated budget category with id ${category.id}.")
    }

    override fun deleteBudgetCategories(categoryIds: List<String>, userId: String): ResponseEntity<String> {
        val deletionResult = runBlocking {
            budgetCategoryService.delete(categoryIds)
        }

        return deletionResult.fold(
            { throw it },
            { ResponseEntity.ok("Budget categories with given ids have been deleted") }
        )
    }

    override fun getAllByCategoryId(categoryId: String): ResponseEntity<List<BudgetDTO>> {
        val budgetsResult = runBlocking {
            budgetService.getAllByCategoryId(categoryId)
        }

        return budgetsResult.fold(
            { throw it },
            { budgets -> ResponseEntity.ok(budgets.map { budgetDtoMapper.toDto(it) }) }
        )
    }

    override fun getCategoriesByParentId(parentId: String): ResponseEntity<List<BudgetCategoryDTO>> {
        val categoryResult = runBlocking {
            budgetCategoryService.getAllByParentId(parentId)
        }

        return categoryResult.fold(
            { throw it },
            { categories -> ResponseEntity.ok(categories.map { budgetDtoMapper.toCategoryDto(it) }) }
        )
    }

    override fun getCategoryById(id: String): ResponseEntity<BudgetCategoryDTO> {
        val categoryResult = runBlocking {
            budgetCategoryService.getById(id)
        }

        return categoryResult.fold(
            { throw it },
            { ResponseEntity.ok(budgetDtoMapper.toCategoryDto(it)) }
        )
    }

}
