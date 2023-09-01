package com.financey.domain.service

import arrow.core.Either
import com.financey.TestDataLoader
import io.mockk.MockKAnnotations
import io.mockk.every
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.impl.annotations.MockK
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.math.BigDecimal
import java.time.LocalDate

class ProfitCalculatorServiceTests {

    @MockK
    lateinit var expenseCalculatorService: ExpenseCalculatorService

    @InjectMockKs
    lateinit var profitCalculatorService: ProfitCalculatorService

    @BeforeEach
    fun setup() {
        MockKAnnotations.init(this)
    }

    @Test
    fun `calculates profit based on price changes for period correctly`() = runBlocking {
        // given
        val testData = TestDataLoader.loadProfitByPeriodTestData()
        val expectedResult = BigDecimal(-7800)
        every { runBlocking { expenseCalculatorService.findBalanceForPeriodFromEntries(any(), any(), any()) }
        } answers { Either.Right(BigDecimal(-9000)) }

        // when
        val result = profitCalculatorService.getProfitByPeriodAndId(
            Pair(LocalDate.of(2023, 2, 1), LocalDate.of(2023, 7, 1)), testData, null).fold( { it }, { it })

        // then
        Assertions.assertEquals(expectedResult, result)
    }

    @Test
    fun `calculates profit based on price changes for period with exclusion date correctly`() = runBlocking {
        // given
        val testData = TestDataLoader.loadProfitByPeriodTestData()
        val expectedResult = BigDecimal(-1800)
        every { runBlocking { expenseCalculatorService.findBalanceForPeriodFromEntries(any(), any(), any()) }
        } answers { Either.Right(BigDecimal(0)) }

        // when
        val result = profitCalculatorService.getProfitByPeriodAndId(
            Pair(LocalDate.of(2023, 2, 1), LocalDate.of(2023, 7, 1)), testData, LocalDate.of(2023, 5, 1))
            .fold( { it }, { it })

        // then
        Assertions.assertEquals(expectedResult, result)
    }

}