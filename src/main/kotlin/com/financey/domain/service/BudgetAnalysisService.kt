package com.financey.domain.service

import arrow.core.Either
import arrow.core.continuations.either
import com.financey.domain.error.FinanceyError
import com.financey.domain.mapper.BudgetDomainMapper
import com.financey.domain.mapper.EntryDomainMapper
import com.financey.repository.EntryRepository
import mu.KotlinLogging
import org.openapitools.model.EntryType
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.time.LocalDate

@Service
class BudgetAnalysisService(
    @Autowired private val entryRepository: EntryRepository,
    @Autowired private val budgetDomainMapper: BudgetDomainMapper,
    @Autowired private val entryDomainMapper: EntryDomainMapper
) {

    private val logger = KotlinLogging.logger {}

    // todo more descriptive error type?
    suspend fun getBalanceByPeriodAndId(startDate: LocalDate, endDate: LocalDate, budgetId: String):
            Either<FinanceyError, BigDecimal> = either {
        val entries = entryRepository.getAllByBudgetId(budgetId).bind()
        entries
            .map { entryDomainMapper.toDomain(it) }
            .filter {
                (it.date ?: LocalDate.MIN) >= startDate && (it.date ?: LocalDate.MAX) <= endDate
            }
            // todo take currency into consideration
            .map { if (it.entryType == EntryType.EXPENSE) it.value.negate() else it.value }
            .reduceOrNull { a, b -> a.plus(b) } ?: BigDecimal.ZERO
    }

}
