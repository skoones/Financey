package com.financey.domain.service

import arrow.core.Either
import arrow.core.right
import com.financey.TestDataLoader
import com.financey.repository.EntryRepository
import io.mockk.MockKAnnotations
import io.mockk.every
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.impl.annotations.MockK
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.time.LocalDate
import java.time.Month

class BudgetAnalysisServiceTests {

    @MockK
    lateinit var entryRepository: EntryRepository

    @InjectMockKs
    lateinit var budgetAnalysisService: BudgetAnalysisService

    @BeforeEach
    fun setup(): Unit = MockKAnnotations.init(this)

    @Test
    fun `calculates monthly expenses correctly`() = runBlocking {
        // given
        val testData = TestDataLoader.loadMonthlyExpenseTestData()

        testData.forEach { (entries, expectedExpenses) ->
            val budgetId = "budgetId"
            every { entryRepository.getAllByBudgetId(budgetId) } returns Either.Right(entries)

            // when
            val result = budgetAnalysisService.getMonthlyExpenseBalanceByDateAndId(
                date = LocalDate.of(2023, Month.JULY, 5),
                budgetId = budgetId
            )

            // then
            assertEquals(expectedExpenses.right(), result)
        }
    }

}
