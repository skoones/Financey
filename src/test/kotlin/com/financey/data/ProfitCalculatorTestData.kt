package com.financey.data

import com.financey.domain.db.model.BudgetCategory
import com.financey.domain.model.EntryDomain
import com.financey.domain.model.InvestmentEntryDomain
import org.bson.types.ObjectId
import org.openapitools.model.EntryCurrency
import org.openapitools.model.EntryType
import java.math.BigDecimal
import java.time.LocalDate

object ProfitCalculatorTestData {

    val profitTestData = listOf(
        InvestmentEntryDomain(
            id = "1",
            entry = EntryDomain(
                value = BigDecimal(1000),
                currency = EntryCurrency.PLN,
                name = "Test1",
                userId = "user1",
                entryType = EntryType.INCOME,
                date = LocalDate.of(2023, 1, 1)
            ),
            volume = 10,
            marketPriceAtOperation = BigDecimal(100),
            datesToMarketPrices = mapOf(LocalDate.of(2023, 1, 1) to BigDecimal(100),
                LocalDate.of(2023, 1, 1) to BigDecimal(200))
        ),
        InvestmentEntryDomain(
            id = "2",
            entry = EntryDomain(
                value = BigDecimal(4000),
                currency = EntryCurrency.EUR,
                name = "Test2",
                userId = "user1",
                entryType = EntryType.EXPENSE,
                date = LocalDate.of(2023, 2, 15)
            ),
            volume = 20,
            marketPriceAtOperation = BigDecimal(200),
            datesToMarketPrices = mapOf(LocalDate.of(2023, 2, 15) to BigDecimal(190),
                LocalDate.of(2023, 3, 1) to BigDecimal(100))
        ),
        InvestmentEntryDomain(
            id = "3",
            entry = EntryDomain(
                value = BigDecimal(1500),
                currency = EntryCurrency.PLN,
                name = "Test3",
                userId = "user1",
                entryType = EntryType.INCOME,
                date = LocalDate.of(2023, 3, 5)
            ),
            volume = 10,
            marketPriceAtOperation = BigDecimal(150),
            datesToMarketPrices = mapOf(LocalDate.of(2023, 3, 5) to BigDecimal(145),
                LocalDate.of(2023, 4, 5) to BigDecimal(245))
        ),
        InvestmentEntryDomain(
            id = "4",
            entry = EntryDomain(
                value = BigDecimal(2500),
                currency = EntryCurrency.PLN,
                name = "Test4",
                userId = "user1",
                entryType = EntryType.INCOME,
                date = LocalDate.of(2023, 4, 25)
            ),
            volume = 25,
            marketPriceAtOperation = BigDecimal(100),
            datesToMarketPrices = mapOf(LocalDate.of(2023, 4, 25) to BigDecimal(245))
        ),
        InvestmentEntryDomain(
            id = "5",
            entry = EntryDomain(
                value = BigDecimal(9000),
                currency = EntryCurrency.PLN,
                name = "Test5",
                userId = "user1",
                entryType = EntryType.EXPENSE,
                date = LocalDate.of(2023, 5, 20)
            ),
            volume = 30,
            marketPriceAtOperation = BigDecimal(300),
            datesToMarketPrices = mapOf(LocalDate.of(2023, 5, 20) to BigDecimal(290),
                LocalDate.of(2023, 5, 21) to BigDecimal(245),
                LocalDate.of(2023, 5, 22) to BigDecimal(100),
                LocalDate.of(2023, 6, 5) to BigDecimal(390))
        )
    )

    private val budgetCategory1 = BudgetCategory(
        id = ObjectId.get(),
        userId = "user1",
        name = "Category1",
        parentCategoryId = null,
        ancestorCategoryIds = null,
        investment = true
    )

    private val budgetCategory2 = BudgetCategory(
        id = ObjectId.get(),
        userId = "user1",
        name = "Category2",
        parentCategoryId = null,
        ancestorCategoryIds = null,
        investment = true
    )

    private val budgetCategory3 = BudgetCategory(
        id = ObjectId.get(),
        userId = "user1",
        name = "Category3",
        parentCategoryId = null,
        ancestorCategoryIds = null,
        investment = true
    )

    private val budgetCategory4 = BudgetCategory(
        id = ObjectId.get(),
        userId = "user1",
        name = "Category4",
        parentCategoryId = null,
        ancestorCategoryIds = null,
        investment = true
    )

    val marketValueTestData: Map<BudgetCategory?, List<InvestmentEntryDomain>> = mapOf(
        budgetCategory1 to listOf(
            InvestmentEntryDomain(
                id = "6",
                entry = EntryDomain(
                    value = BigDecimal(5000),
                    currency = EntryCurrency.PLN,
                    name = "Test6",
                    userId = "user1",
                    entryType = EntryType.EXPENSE,
                    date = LocalDate.of(2023, 6, 1)
                ),
                volume = 50,
                marketPriceAtOperation = BigDecimal(100),
                datesToMarketPrices = mapOf(LocalDate.of(2023, 6, 1) to BigDecimal(100),
                    LocalDate.of(2023, 6, 15) to BigDecimal(200))
            )
        ),
        budgetCategory2 to listOf(
            InvestmentEntryDomain(
                id = "7",
                entry = EntryDomain(
                    value = BigDecimal(6000),
                    currency = EntryCurrency.EUR,
                    name = "Test7",
                    userId = "user1",
                    entryType = EntryType.EXPENSE,
                    date = LocalDate.of(2023, 7, 1)
                ),
                volume = 60,
                marketPriceAtOperation = BigDecimal(100),
                datesToMarketPrices = mapOf(LocalDate.of(2023, 7, 1) to BigDecimal(100))
            )
        ),
        budgetCategory3 to listOf(
            InvestmentEntryDomain(
                id = "8",
                entry = EntryDomain(
                    value = BigDecimal(7000),
                    currency = EntryCurrency.PLN,
                    name = "Test8",
                    userId = "user1",
                    entryType = EntryType.EXPENSE,
                    date = LocalDate.of(2023, 6, 10)
                ),
                volume = 70,
                marketPriceAtOperation = BigDecimal(100),
                datesToMarketPrices = mapOf(LocalDate.of(2023, 6, 10) to BigDecimal(100),
                    LocalDate.of(2023, 6, 20) to BigDecimal(210),
                    LocalDate.of(2023, 6, 21) to BigDecimal(100))
            )
        ),
        budgetCategory4 to listOf(
            InvestmentEntryDomain(
                id = "9",
                entry = EntryDomain(
                    value = BigDecimal(8000),
                    currency = EntryCurrency.EUR,
                    name = "Test9",
                    userId = "user1",
                    entryType = EntryType.EXPENSE,
                    date = LocalDate.of(2023, 7, 5)
                ),
                volume = 80,
                marketPriceAtOperation = BigDecimal(100),
                datesToMarketPrices = mapOf(LocalDate.of(2023, 7, 5) to BigDecimal(100))
            ),
            InvestmentEntryDomain(
                id = "10",
                entry = EntryDomain(
                    value = BigDecimal(9000),
                    currency = EntryCurrency.PLN,
                    name = "Test10",
                    userId = "user1",
                    entryType = EntryType.EXPENSE,
                    date = LocalDate.of(2023, 7, 10)
                ),
                volume = 90,
                marketPriceAtOperation = BigDecimal(100),
                datesToMarketPrices = mapOf(LocalDate.of(2023, 7, 10) to BigDecimal(130),
                    LocalDate.of(2023, 7, 15) to BigDecimal(230))
            )
        )
    )

}