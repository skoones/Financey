package com.financey.api.controller

import arrow.core.Either.Left
import arrow.core.Either.Right
import com.financey.api.mapper.EntryDtoMapper
import com.financey.domain.error.ElementDoesNotExistError
import com.financey.domain.service.EntryService
import kotlinx.coroutines.runBlocking
import org.openapitools.api.EntryApi
import org.openapitools.model.EntryDTO
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatusCode
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController

@RestController
class EntryController(
    @Autowired private val entryService: EntryService,
    @Autowired private val entryDtoMapper: EntryDtoMapper
) : EntryApi {

    override fun addEntry(entryDTO: EntryDTO): ResponseEntity<String> {
        val entry = entryDtoMapper.fromDto(entryDTO)
        entryService.save(entry)

        return ResponseEntity.ok("Entity saved")
    }

    override fun deleteEntriesByIds(ids: List<String>): ResponseEntity<String> {
        val deletionResult = runBlocking {
            entryService.delete(ids)
        }
        return when (deletionResult) {
            // todo extract method to utils + improve
            is Left -> when (deletionResult.value) {
                is ElementDoesNotExistError ->
                    ResponseEntity.status(HttpStatusCode.valueOf(400)).body((deletionResult.value as ElementDoesNotExistError).message)
            }
            is Right -> ResponseEntity.ok("Entities with given ids have been deleted")
        }
    }

}
