package com.financey.api.controller

import arrow.core.Either.Right
import com.financey.api.mapper.EntryDtoMapper
import com.financey.domain.service.EntryService
import com.financey.domain.service.InvestmentEntryService
import kotlinx.coroutines.runBlocking
import org.openapitools.api.EntryApi
import org.openapitools.model.EntryDTO
import org.openapitools.model.InvestmentEntryDTO
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.RestController

@RestController
@CrossOrigin
class EntryController(
    @Autowired private val entryService: EntryService,
    @Autowired private val investmentEntryService: InvestmentEntryService,
    @Autowired private val entryDtoMapper: EntryDtoMapper
) : EntryApi {

    override fun addEntry(entryDTO: EntryDTO): ResponseEntity<String> {
        val entry = entryDtoMapper.fromDto(entryDTO)
        val savedEntry = runBlocking {
            entryService.save(entry)
        } as Right

        return ResponseEntity.ok("Entry saved with id ${savedEntry.value.id}.")
    }

    override fun addInvestmentEntry(investmentEntryDTO: InvestmentEntryDTO): ResponseEntity<String> {
        val entry = entryDtoMapper.fromInvestmentDto(investmentEntryDTO)
        val savedEntry = runBlocking {
            investmentEntryService.save(entry)
        } as Right

        return ResponseEntity.ok("Investment entry saved with id ${savedEntry.value.id}.")
    }

    override fun updateEntry(entryDTO: EntryDTO): ResponseEntity<String> {
       val entry = entryDtoMapper.fromDto(entryDTO)
       runBlocking {
           entryService.save(entry)
       }

       return ResponseEntity.ok("Updated entry with id ${entry.id}.")
    }

    override fun updateInvestmentEntry(investmentEntryDTO: InvestmentEntryDTO): ResponseEntity<String> {
        val entry = entryDtoMapper.fromInvestmentDto(investmentEntryDTO)
        runBlocking {
            investmentEntryService.save(entry)
        }

        return ResponseEntity.ok("Updated investment entry with id ${entry.id}.")
    }

    override fun deleteEntriesByIds(ids: List<String>): ResponseEntity<String> {
        val deletionResult = runBlocking {
            entryService.delete(ids)
        }
        return deletionResult.fold({ throw it },
            { ResponseEntity.ok("Entries with given ids have been deleted") })
    }

    override fun deleteInvestmentEntriesByIds(ids: List<String>): ResponseEntity<String> {
        val deletionResult = runBlocking {
            investmentEntryService.delete(ids)
        }
        return deletionResult.fold({ throw it },
            { ResponseEntity.ok("Entries with given ids have been deleted") })
    }
    override fun getEntriesByBudgetId(budgetId: String): ResponseEntity<List<EntryDTO>> {
        val entriesResult = runBlocking {
            entryService.getAllByBudgetId(budgetId)
        }

        return entriesResult.fold(
            { throw it },
            { entries -> ResponseEntity.ok(entries.map { entryDtoMapper.toDto(it) })}
        )
    }

    override fun getInvestmentEntriesByBudgetId(budgetId: String): ResponseEntity<List<InvestmentEntryDTO>> {
        val entriesResult = runBlocking {
            investmentEntryService.getAllByBudgetId(budgetId)
        }

        return entriesResult.fold(
            { throw it },
            { entries -> ResponseEntity.ok(entries.map { entryDtoMapper.toInvestmentDto(it) })}
        )
    }

}
