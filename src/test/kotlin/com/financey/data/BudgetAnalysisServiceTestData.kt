package com.financey.data

import com.financey.domain.model.EntryDomain
import org.openapitools.model.EntryCurrency
import org.openapitools.model.EntryType
import java.math.BigDecimal
import java.time.LocalDate
import java.time.Month

object BudgetAnalysisServiceTestData {
    val monthlyExpenseData: List<List<EntryDomain>> = listOf(
            listOf(
                EntryDomain(
                    date = LocalDate.of(2023, Month.JULY, 1),
                    entryType = EntryType.INCOME,
                    value = BigDecimal(10),
                    currency = EntryCurrency.PLN,
                    name = "test",
                    userId = "test"
                ),
                EntryDomain(
                    date = LocalDate.of(2023, Month.JULY, 1),
                    entryType = EntryType.EXPENSE,
                    value = BigDecimal(50),
                    currency = EntryCurrency.PLN,
                    name = "test",
                    userId = "test"
                ),
                EntryDomain(
                    date = LocalDate.of(2023, Month.JUNE, 1),
                    entryType = EntryType.EXPENSE,
                    value = BigDecimal(20),
                    currency = EntryCurrency.PLN,
                    name = "test",
                    userId = "test"
                ),
                EntryDomain(
                    date = LocalDate.of(2022, Month.JULY, 1),
                    entryType = EntryType.INCOME,
                    value = BigDecimal(20),
                    currency = EntryCurrency.PLN,
                    name = "test",
                    userId = "test"
                )
            ),
            listOf(
                EntryDomain(
                    date = LocalDate.of(2023, Month.JULY, 1),
                    entryType = EntryType.EXPENSE,
                    value = BigDecimal(10),
                    currency = EntryCurrency.PLN,
                    name = "test",
                    userId = "test"
                ),
                EntryDomain(
                    date = LocalDate.of(2023, Month.JULY, 1),
                    entryType = EntryType.INCOME,
                    value = BigDecimal(50),
                    currency = EntryCurrency.PLN,
                    name = "test",
                    userId = "test"
                )
            ),
            listOf(
                EntryDomain(
                    date = LocalDate.of(2022, Month.JULY, 1),
                    entryType = EntryType.EXPENSE,
                    value = BigDecimal(10),
                    currency = EntryCurrency.PLN,
                    name = "test",
                    userId = "test"
                ),
                EntryDomain(
                    date = LocalDate.of(2023, Month.JULY, 1),
                    entryType = EntryType.INCOME,
                    value = BigDecimal(50),
                    currency = EntryCurrency.PLN,
                    name = "test",
                    userId = "test"
                )
            ),
            listOf(
                EntryDomain(
                    date = LocalDate.of(2023, Month.JUNE, 30),
                    entryType = EntryType.EXPENSE,
                    value = BigDecimal(10),
                    currency = EntryCurrency.PLN,
                    name = "test",
                    userId = "test"
                ),
                EntryDomain(
                    date = LocalDate.of(2022, Month.JULY, 1),
                    entryType = EntryType.INCOME,
                    value = BigDecimal(50),
                    currency = EntryCurrency.PLN,
                    name = "test",
                    userId = "test"
                )
            )
        )
}
