package com.financey.api.controller

import com.financey.api.mapper.EntryDtoMapper
import com.financey.domain.service.EntryService
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
        entryService.save(entry)

        return ResponseEntity.ok("Entity saved")
    }

    override fun deleteEntriesByIds(ids: List<String>): ResponseEntity<String> {
        entryService.delete(ids)
        return ResponseEntity.ok("Entities with given ids have been deleted")
    }

}
