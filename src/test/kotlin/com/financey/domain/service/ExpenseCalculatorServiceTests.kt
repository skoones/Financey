package com.financey.domain.service

import arrow.core.Either
import com.financey.TestDataLoader
import com.financey.domain.model.EntryDomain
import io.mockk.MockKAnnotations
import io.mockk.every
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.impl.annotations.MockK
import io.mockk.slot
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.math.BigDecimal
import java.time.LocalDate
import java.time.Month

class ExpenseCalculatorServiceTests {

    @MockK
    lateinit var currencyService: CurrencyService

    @InjectMockKs
    lateinit var expenseCalculatorService: ExpenseCalculatorService

    @BeforeEach
    fun setup() {
        MockKAnnotations.init(this)
    }

    @BeforeEach
    fun currencySetup() {
        val entryParam = slot<EntryDomain>()
        every { runBlocking {
            currencyService.changeEntryToUseBaseCurrency(capture(entryParam))
        } } answers { Either.Right(entryParam.captured) }
    }

    @Test
    fun `calculates expense balance for period correctly`() = runBlocking {
        // given
        val testData = TestDataLoader.loadMonthlyExpenseTestData()
        val expectedResults: List<BigDecimal> = listOf(BigDecimal(-40), BigDecimal(40), BigDecimal(50), BigDecimal(0))

        testData.zip(expectedResults).forEach { (entries, expectedResult)->
            // when
            val result = expenseCalculatorService.findBalanceForPeriodFromEntries(
                entries = entries,
                startDate = LocalDate.of(2023, Month.JULY, 1),
                endDate = LocalDate.of(2023, Month.JULY, 5)
            ).fold( { it }, { it })

            // then
            assertEquals(expectedResult, result)
        }
    }

    @Test
    fun `calculates expense sum for categories correctly`() = runBlocking {
        // given
        val testData = TestDataLoader.loadCategoryToExpenseSumTestData()
        val testInput = testData.first
        val expectedResults = testData.second

        // when
        val result = expenseCalculatorService.findExpenseSumContexts(testInput).fold( { it }, { it })

        // then
        assertEquals(expectedResults, result)
    }

    @Test
    fun `calculates expense sum for period correctly`() = runBlocking {
        // given
        val testData = TestDataLoader.loadMonthlyExpenseTestData()
        val expectedResults: List<BigDecimal> = listOf(BigDecimal(50), BigDecimal(10), BigDecimal(0), BigDecimal(0))

        testData.zip(expectedResults).forEach { (entries, expectedResult)->
            // when
            val result = expenseCalculatorService.findExpenseSumForPeriodFromEntries(
                entries = entries,
                startDate = LocalDate.of(2023, Month.JULY, 1),
                endDate = LocalDate.of(2023, Month.JULY, 5)
            ).fold( { it }, { it })

            // then
            assertEquals(expectedResult, result)
        }
    }

}
