package com.financey.api.controller

import com.financey.api.mapper.BudgetAnalysisDtoMapper
import com.financey.domain.service.BudgetAnalysisService
import kotlinx.coroutines.runBlocking
import org.openapitools.api.BudgetAnalysisApi
import org.openapitools.model.SubcategoryExpenseSumDTO
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.RestController
import java.math.BigDecimal
import java.time.LocalDate

@RestController
@CrossOrigin
class BudgetAnalysisController(
    @Autowired private val budgetAnalysisService: BudgetAnalysisService,
    @Autowired private val budgetAnalysisDtoMapper: BudgetAnalysisDtoMapper
) : BudgetAnalysisApi {
    override fun getExpenseBalanceByPeriodAndId(
        startDate: LocalDate,
        endDate: LocalDate,
        budgetId: String
    ): ResponseEntity<BigDecimal> {
        val result = runBlocking {
            budgetAnalysisService.getBalanceByPeriodAndId(startDate, endDate, budgetId)
        }

        return result.fold(
            { throw it },
            { ResponseEntity.ok(it)  }
        )
    }

    override fun getTotalExpensesForSubcategoriesByCategoryId(budgetCategoryId: String):
            ResponseEntity<List<SubcategoryExpenseSumDTO>> {
        val result = runBlocking {
            budgetAnalysisService.getTotalExpensesForSubcategoriesByCategoryId(budgetCategoryId)
        }

        return result.fold(
            { throw it },
            { ResponseEntity.ok(it
                .map { sumContext -> budgetAnalysisDtoMapper.toDto(sumContext) })  }
        )
    }

    override fun getExpenseSumByPeriodAndId(
        startDate: LocalDate,
        endDate: LocalDate,
        budgetId: String
    ): ResponseEntity<BigDecimal> {
        val result = runBlocking {
            budgetAnalysisService.getExpenseSumByPeriodAndId(startDate, endDate, budgetId)
        }

        return result.fold(
            { throw it },
            { ResponseEntity.ok(it)  }
        )
    }

}