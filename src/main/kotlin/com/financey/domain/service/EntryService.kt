package com.financey.domain.service

import arrow.core.Either
import arrow.core.continuations.either
import com.financey.domain.error.PersistenceError
import com.financey.domain.mapper.EntryDomainMapper
import com.financey.domain.model.EntryDomain
import com.financey.repository.EntryRepository
import mu.KotlinLogging
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class EntryService(
    private val entryRepository: EntryRepository,
    @Autowired private val entryDomainMapper: EntryDomainMapper
) {
    private val logger = KotlinLogging.logger {}

    suspend fun save(entry: EntryDomain): Either<Nothing, EntryDomain> = either {
        val savedEntry = entryRepository.save(entryDomainMapper.fromDomain(entry)).bind()
        val savedEntryDomain = entryDomainMapper.toDomain(savedEntry)
        logger.debug { "Saved $savedEntry to database" }
        savedEntryDomain
    }

    suspend fun delete(ids: List<String>): Either<PersistenceError, Unit> = either {
        entryRepository.deleteByIds(ids).bind()
        logger.debug { "Removed entries with ids $ids from database" }
    }

    suspend fun getAllByBudgetId(budgetId: String): Either<PersistenceError, List<EntryDomain>> = either {
        val entries = entryRepository.getAllByBudgetId(budgetId).bind()
            .map { entryDomainMapper.toDomain(it) }
        logger.debug { "Retrieved entries for budget id $budgetId from database" }
        entries
    }

}
