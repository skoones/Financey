package com.financey.data

import com.financey.domain.model.EntryDomain
import com.financey.domain.model.InvestmentEntryDomain
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
                LocalDate.of(2023, 3, 1) to BigDecimal(100)) // profit: -90 * 20 = -1800
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
                LocalDate.of(2023, 6, 5) to BigDecimal(390)) // profit: 100 * 30 = 3000
        )
    )
}