package com.financey.domain.service

import arrow.core.Either
import arrow.core.continuations.either
import com.financey.domain.error.PersistenceError
import com.financey.domain.model.InvestmentEntry
import com.financey.repository.InvestmentEntryRepository
import mu.KotlinLogging
import org.springframework.stereotype.Service

@Service
class InvestmentEntryService(
    private val investmentEntryRepository: InvestmentEntryRepository
) {

    private val logger = KotlinLogging.logger {}

    suspend fun save(entry: InvestmentEntry): Either<Nothing, InvestmentEntry> = either {
        val savedEntry = investmentEntryRepository.save(entry).bind()
        logger.debug { "Saved $savedEntry to database" }
        savedEntry
    }

    suspend fun getAllByBudgetId(budgetId: String): Either<PersistenceError, List<InvestmentEntry>> = either {
        val entries = investmentEntryRepository.getAllByBudgetId(budgetId).bind()
        logger.debug { "Retrieved investment entries for budget id $budgetId from database" }
        entries
    }

}