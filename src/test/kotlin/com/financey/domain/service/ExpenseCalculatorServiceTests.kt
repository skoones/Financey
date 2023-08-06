package com.financey.domain.service

import com.financey.TestDataLoader
import io.mockk.MockKAnnotations
import io.mockk.impl.annotations.InjectMockKs
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.math.BigDecimal
import java.time.LocalDate
import java.time.Month

class ExpenseCalculatorServiceTests {

    @InjectMockKs
    lateinit var expenseCalculatorService: ExpenseCalculatorService

    @BeforeEach
    fun setup() {
        MockKAnnotations.init(this)
    }

    @Test
    fun `calculates monthly expenses correctly`() = runBlocking {
        // given
        val testData = TestDataLoader.loadMonthlyExpenseTestData()
        val expectedResults: List<BigDecimal> = listOf(BigDecimal(-40), BigDecimal(40), BigDecimal(50), BigDecimal(0))

        testData.zip(expectedResults).forEach { (entries, expectedResult)->
            // when
            val result = expenseCalculatorService.findBalanceForPeriodFromEntries(
                entries = entries,
                startDate = LocalDate.of(2023, Month.JULY, 1),
                endDate = LocalDate.of(2023, Month.JULY, 5)
            )

            // then
            assertEquals(expectedResult, result)
        }
    }

}
