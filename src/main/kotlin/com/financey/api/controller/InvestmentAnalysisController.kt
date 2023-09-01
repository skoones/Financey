package com.financey.api.controller

import com.financey.domain.service.InvestmentAnalysisService
import kotlinx.coroutines.runBlocking
import mu.KotlinLogging
import org.openapitools.api.InvestmentAnalysisApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.RestController
import java.math.BigDecimal
import java.time.LocalDate

@RestController
@CrossOrigin
class InvestmentAnalysisController(
    @Autowired private val investmentAnalysisService: InvestmentAnalysisService,
) : InvestmentAnalysisApi {

    val logger = KotlinLogging.logger {}

    override fun getProfitByPeriodAndId(
        startDate: LocalDate,
        endDate: LocalDate,
        budgetId: String,
        excludePurchasesFrom: LocalDate?
    ): ResponseEntity<BigDecimal> {
        val result = runBlocking {
            investmentAnalysisService.getProfitByPeriodAndId(startDate, endDate, budgetId, excludePurchasesFrom)
        }

        return result.fold(
            {
                logger.error { it.message }
                throw it
            },
            { ResponseEntity.ok(it)  }
        )
    }

}