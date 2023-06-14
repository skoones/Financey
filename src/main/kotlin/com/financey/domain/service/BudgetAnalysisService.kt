package com.financey.domain.service

import arrow.core.Either
import arrow.core.continuations.either
import com.financey.domain.error.FinanceyError
import com.financey.repository.EntryRepository
import org.openapitools.model.EntryType
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.time.LocalDate
import java.time.Month
import java.time.Year

@Service
class BudgetAnalysisService(
    @Autowired private val entryRepository: EntryRepository
) {
    // todo more descriptive error type?
    suspend fun getMonthlyExpenseBalanceByDateAndId(date: LocalDate, budgetId: String): Either<FinanceyError, BigDecimal> = either {
        val entries = entryRepository.getAllByBudgetId(budgetId).bind()
        entries
            .filter { (it.date?.month ?: Month.JANUARY) == date.month &&
                    (it.date?.year ?: Year.MIN_VALUE) == date.year }
            // todo take currency into consideration
            .map { Pair(it.entryType, it.value) }
            .reduceOrNull { a, b ->
                if (b.first == EntryType.EXPENSE) {
                    Pair(EntryType.EXPENSE, a.second.plus(b.second))
                } else {
                    Pair(EntryType.INCOME, a.second.minus(b.second))
                }
            }
            ?.second ?: BigDecimal.ZERO
    }

}