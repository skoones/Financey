package com.financey.api.controller

import com.financey.api.controller.mapper.EntryDtoMapper
import com.financey.domain.service.EntryService
import mu.KLogger
import mu.KotlinLogging
import org.openapitools.api.EntryApi
import org.openapitools.model.EntryDTO
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatusCode
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController

@RestController
class EntryController(
    @Autowired private val entryService: EntryService,
    @Autowired private val entryDtoMapper: EntryDtoMapper,
) : EntryApi {
    private val logger: KLogger = KotlinLogging.logger { }

    override fun addEntry(entryDTO: EntryDTO): ResponseEntity<Unit> {
        // todo Either with left/right and based on this different HTTP status code in the response
        val entry = entryDtoMapper.fromDto(entryDTO)
        val savedEntry = entryService.save(entry)
        logger.debug { "Saved $savedEntry to database" }
        return ResponseEntity(HttpStatusCode.valueOf(200))
    }

    override fun deleteEntriesByIds(ids: List<String>): ResponseEntity<Unit> {
        // todo Either with left/right and based on this different HTTP status code in the response
        entryService.delete(ids)
        return ResponseEntity(HttpStatusCode.valueOf(200))
    }
}
