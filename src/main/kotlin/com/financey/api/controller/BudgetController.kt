package com.financey.api.controller

import arrow.core.Either.Right
import com.financey.api.mapper.BudgetDtoMapper
import com.financey.domain.service.BudgetService
import kotlinx.coroutines.runBlocking
import org.openapitools.api.BudgetApi
import org.openapitools.model.BudgetDTO
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController

@RestController
class BudgetController(
    @Autowired private val budgetService: BudgetService,
    @Autowired private val budgetDtoMapper: BudgetDtoMapper
) : BudgetApi {

    override fun addBudget(budgetDTO: BudgetDTO): ResponseEntity<String> {
        val budget = budgetDtoMapper.fromDto(budgetDTO)
        val savedBudget = runBlocking {
            budgetService.save(budget)
        } as Right

        return ResponseEntity.ok("Budget saved with id ${savedBudget.value.id}.")
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
            budgetService.getAllByUserId(userId)
        }

        return budgetsResult.fold(
            { throw it },
            { budgets -> ResponseEntity.ok(budgets.map { budgetDtoMapper.toDto(it) })}
        )
    }

}
