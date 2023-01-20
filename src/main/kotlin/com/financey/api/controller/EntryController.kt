package com.financey.api.controller

import arrow.core.Either.Right
import com.financey.api.mapper.EntryDtoMapper
import com.financey.domain.service.EntryService
import kotlinx.coroutines.runBlocking
import org.openapitools.api.EntryApi
import org.openapitools.model.EntryDTO
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController

@RestController
class EntryController(
    @Autowired private val entryService: EntryService,
    @Autowired private val entryDtoMapper: EntryDtoMapper
) : EntryApi {

    override fun addEntry(entryDTO: EntryDTO): ResponseEntity<String> {
        val entry = entryDtoMapper.fromDto(entryDTO)
        val savedEntry = runBlocking {
            entryService.save(entry)
        } as Right

        return ResponseEntity.ok("Entry saved with id ${savedEntry.value.id}.")
    }

    override fun updateEntry(entryDTO: EntryDTO): ResponseEntity<String> {
       val entry = entryDtoMapper.fromDto(entryDTO)
       runBlocking {
           entryService.save(entry)
       }

       return ResponseEntity.ok("Updated entry with id ${entry.id}.")
    }

    override fun deleteEntriesByIds(ids: List<String>): ResponseEntity<String> {
        val deletionResult = runBlocking {
            entryService.delete(ids)
        }
        return deletionResult.fold({ throw it },
            { ResponseEntity.ok("Entries with given ids have been deleted") })
    }

}
