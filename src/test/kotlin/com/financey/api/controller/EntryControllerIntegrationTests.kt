package com.financey.api.controller;

import com.financey.api.mapper.EntryDtoMapper
import com.financey.domain.model.Entry
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.junit.jupiter.MockitoExtension
import org.openapitools.model.EntryCurrency
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.HttpStatus
import org.springframework.test.context.ActiveProfiles
import java.math.BigDecimal

@SpringBootTest
@ExtendWith(MockitoExtension::class)
@ActiveProfiles(value = ["test"])
class EntryControllerIntegrationTests(@Autowired val entryController: EntryController,
                                      @Autowired val entryDtoMapper: EntryDtoMapper) {

    @Test
    fun `creates and deletes entry`(): Unit = runBlocking {
        val entry =
                Entry(value = BigDecimal.valueOf(1), currency = EntryCurrency.EUR, name = "test entry", userId = "demo")
        val entryDto = entryDtoMapper.toDto(entry);
        val response = entryController.addEntry(entryDto)
        assertEquals(HttpStatus.OK, response.statusCode)
        val savedId = response.body?.substringAfter("id ")?.trim('.') ?: ""

        entryController.updateEntry(entryDto.copy(name = "updated name"))
//        assertEquals()
        val deleteResponse = entryController.deleteEntriesByIds(listOf(savedId))
        assertEquals(deleteResponse.body, "Entries with given ids have been deleted")
    }

}
