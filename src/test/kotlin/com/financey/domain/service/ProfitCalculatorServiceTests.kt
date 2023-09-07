package com.financey.domain.service

import arrow.core.Either
import com.financey.TestDataLoader
import com.financey.data.ProfitCalculatorTestData
import com.financey.domain.model.EntryDomain
import com.financey.domain.model.SubcategoryMarketValueDomain
import io.mockk.MockKAnnotations
import io.mockk.every
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.impl.annotations.MockK
import io.mockk.slot
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.math.BigDecimal
import java.time.LocalDate

class ProfitCalculatorServiceTests {

    @MockK
    lateinit var expenseCalculatorService: ExpenseCalculatorService

    @MockK
    lateinit var currencyService: CurrencyService

    @InjectMockKs
    lateinit var profitCalculatorService: ProfitCalculatorService

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

        val amountParam = slot<BigDecimal>()
        every { runBlocking {
            currencyService.exchange(any(), capture(amountParam), any())
        } } answers { Either.Right(amountParam.captured) }
    }

    @Test
    fun `calculates profit based on price changes for period correctly`() = runBlocking {
        // given
        val testData = TestDataLoader.loadProfitByPeriodTestData()
        val expectedResult = BigDecimal(5700)
        every { runBlocking { expenseCalculatorService.findBalanceForPeriodFromEntries(any(), any(), any()) }
        } answers { Either.Right(BigDecimal(-8000)) }

        // when
        val result = profitCalculatorService.getProfitByDate(
             LocalDate.of(2023, 7, 1), testData, null).fold( { it }, { it })

        // then
        Assertions.assertEquals(expectedResult, result)
    }

    @Test
    fun `calculates profit based on price changes for period with exclusion date correctly`() = runBlocking {
        // given
        val testData = TestDataLoader.loadProfitByPeriodTestData()
        val expectedResult = BigDecimal(3000)
        every { runBlocking { expenseCalculatorService.findBalanceForPeriodFromEntries(any(), any(), any()) }
        } answers { Either.Right(BigDecimal(1000)) }

        // when
        val result = profitCalculatorService.getProfitByDate(
            LocalDate.of(2023, 7, 1), testData, LocalDate.of(2023, 5, 1))
            .fold( { it }, { it })

        // then
        Assertions.assertEquals(expectedResult, result)
    }

    @Test
    fun `returns correct market values for each subcategory`() = runBlocking {
        // given
        val testData = ProfitCalculatorTestData.marketValueTestData
        val endDate = LocalDate.of(2023, 7, 1)
        val expectedMarketValueForCategory1 = BigDecimal(10000)
        val expectedMarketValueForCategory2 = BigDecimal(6000)
        val expectedMarketValueForCategory3 = BigDecimal(7000)
        val expectedMarketValueForCategory4 = BigDecimal(8000)

        // when
        val result = profitCalculatorService.findMarketValueContexts(testData, endDate).fold({ it }, { it })
            as List<SubcategoryMarketValueDomain>

        // then
        val category1MarketValue = result.find { it.subcategoryName == "Category1" }?.marketValue
        val category2MarketValue = result.find { it.subcategoryName == "Category2" }?.marketValue

        Assertions.assertEquals(expectedMarketValueForCategory1, category1MarketValue)
        Assertions.assertEquals(expectedMarketValueForCategory2, category2MarketValue)
    }

}