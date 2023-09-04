package com.financey.api.controller

import com.financey.api.mapper.InvestmentAnalysisDtoMapper
import com.financey.domain.service.InvestmentAnalysisService
import kotlinx.coroutines.runBlocking
import mu.KotlinLogging
import org.openapitools.api.InvestmentAnalysisApi
import org.openapitools.model.SubcategoryMarketValueDTO
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
    @Autowired private val investmentAnalysisDtoMapper: InvestmentAnalysisDtoMapper
) : InvestmentAnalysisApi {

    val logger = KotlinLogging.logger {}

    override fun getProfitByDateAndId(
        date: LocalDate,
        budgetId: String,
        excludePurchasesFrom: LocalDate?
    ): ResponseEntity<BigDecimal> {
        val result = runBlocking {
            investmentAnalysisService.getProfitByDateAndId(date, budgetId, excludePurchasesFrom)
        }

        return result.fold(
            {
                logger.error { it.message }
                throw it
            },
            { ResponseEntity.ok(it)  }
        )
    }

    override fun getTotalMarketValueForSubcategoriesAndPeriodByCategoryId(
        startDate: LocalDate,
        endDate: LocalDate,
        budgetCategoryId: String
    ): ResponseEntity<List<SubcategoryMarketValueDTO>> {
        val result = runBlocking {
            investmentAnalysisService.getTotalMarketValueForSubcategoriesAndPeriodByCategoryId(
                startDate, endDate, budgetCategoryId)
        }

        return result.fold(
            {
                logger.error { it.message }
                throw it
            },
            { ResponseEntity.ok(it
                .map { sumDomain -> investmentAnalysisDtoMapper.toDto(sumDomain) })  }
        )
    }

}