package com.financey.domain.service

import arrow.core.Either
import arrow.core.continuations.either
import com.financey.domain.error.FinanceyError
import com.financey.repository.EntryRepository
import mu.KotlinLogging
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

    private val logger = KotlinLogging.logger {}

    // todo more descriptive error type?
    suspend fun getMonthlyExpenseBalanceByDateAndId(date: LocalDate, budgetId: String):
            Either<FinanceyError, BigDecimal> = either {
        logger.debug { "date: $date" }
        val entries = entryRepository.getAllByBudgetId(budgetId).bind()
        entries
            .filter { (it.date?.month ?: Month.JANUARY) == date.month &&
                    (it.date?.year ?: Year.MIN_VALUE) == date.year }
            // todo take currency into consideration
            .map { if (it.entryType == EntryType.INCOME) it.value.negate() else it.value }
            .reduceOrNull { a, b -> a.plus(b) } ?: BigDecimal.ZERO
    }

}
