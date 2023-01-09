package com.financey.domain.service

import com.financey.domain.model.Entry
import com.financey.repository.EntryRepository
import mu.KotlinLogging
import org.springframework.stereotype.Service

@Service
class EntryService(
    private val entryRepository: EntryRepository
) {
    private val logger = KotlinLogging.logger {}

    fun save(entry: Entry): Entry {
        val savedEntry = entryRepository.save(entry)
        logger.debug { "Saved $savedEntry to database" }
        return savedEntry
    }

    fun delete(ids: List<String>) {
        entryRepository.deleteAllById(ids)
    }

}
