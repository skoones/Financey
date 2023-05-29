package com.financey.domain.service

import arrow.core.Either
import arrow.core.continuations.either
import com.financey.domain.error.PersistenceError
import com.financey.domain.model.Entry
import com.financey.repository.EntryRepository
import mu.KotlinLogging
import org.springframework.stereotype.Service

@Service
class EntryService(
    private val entryRepository: EntryRepository
) {
    private val logger = KotlinLogging.logger {}

    suspend fun save(entry: Entry): Either<Nothing, Entry> = either {
        val savedEntry = entryRepository.save(entry).bind()
        logger.debug { "Saved $savedEntry to database" }
        savedEntry
    }

    suspend fun delete(ids: List<String>): Either<PersistenceError, Unit> = either {
        entryRepository.deleteByIds(ids).bind()
        logger.debug { "Removed entries with ids $ids from database" }
    }

    suspend fun getAllByBudgetId(budgetId: String): Either<PersistenceError, List<Entry>> = either {
        val entries = entryRepository.getAllByBudgetId(budgetId).bind()
        logger.debug { "Retrieved entries for budget id $budgetId from database" }
        entries
    }

}
