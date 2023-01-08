package com.financey.domain.service

import com.financey.domain.model.Entry
import com.financey.repository.EntryRepository
import org.springframework.stereotype.Service

@Service
class EntryService(
    private val entryRepository: EntryRepository
) {

    fun save(entry: Entry): Entry = entryRepository.save(entry)

    fun delete(ids: List<String>) {
        entryRepository.deleteAllById(ids)
    }

}
