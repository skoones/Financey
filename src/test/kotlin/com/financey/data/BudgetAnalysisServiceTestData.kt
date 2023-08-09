package com.financey.data

import com.financey.domain.context.SubcategoryExpenseSumContext
import com.financey.domain.db.model.BudgetCategory
import com.financey.domain.model.EntryDomain
import org.bson.types.ObjectId
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
    val categoryToExpenseSumData: Map<BudgetCategory?, List<BigDecimal>>  = mapOf(
        BudgetCategory(ObjectId("6155b0955faba1f03d48c2a1"), "user1", "Category1", null, null) to listOf(
            BigDecimal("100.00"),
            BigDecimal("50.50"),
            BigDecimal("75.20")
        ),
        BudgetCategory(ObjectId("6155b0955faba1f03d48c2a2"), "user2", "Category2", null, null) to listOf(
            BigDecimal("200.25"),
            BigDecimal("80.10")
        ),
        BudgetCategory(ObjectId("6155b0955faba1f03d48c2a3"), "user3", "Category3", null, null) to listOf(
            BigDecimal("300.00"),
            BigDecimal("150.75"),
            BigDecimal("90.90"),
            BigDecimal("70.00")
        )
    )

    val categoryToExpenseSumResults = listOf(
        SubcategoryExpenseSumContext("6155b0955faba1f03d48c2a1", "Category1", BigDecimal("225.70")),
        SubcategoryExpenseSumContext("6155b0955faba1f03d48c2a2", "Category2", BigDecimal("280.35")),
        SubcategoryExpenseSumContext("6155b0955faba1f03d48c2a3", "Category3", BigDecimal("611.65")),
    )

}
