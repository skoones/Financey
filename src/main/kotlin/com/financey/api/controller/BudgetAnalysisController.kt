package com.financey.api.controller

import com.financey.domain.service.BudgetAnalysisService
import kotlinx.coroutines.runBlocking
import org.openapitools.api.BudgetAnalysisApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.RestController
import java.math.BigDecimal
import java.time.LocalDate

@RestController
@CrossOrigin
class BudgetAnalysisController(
    @Autowired private val budgetAnalysisService: BudgetAnalysisService
) : BudgetAnalysisApi {
    override fun getMonthlyExpenseBalanceByDateAndId(date: LocalDate, budgetId: String): ResponseEntity<BigDecimal> {
        val result = runBlocking {
            budgetAnalysisService.getMonthlyExpenseBalanceByDateAndId(date, budgetId)
        }

        return result.fold(
            { throw it },
            { ResponseEntity.ok(it)  }
        )
    }
}