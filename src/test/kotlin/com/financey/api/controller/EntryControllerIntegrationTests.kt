package com.financey.api.controller

import com.financey.api.mapper.EntryDtoMapper
import com.financey.domain.model.EntryDomain
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.junit.jupiter.MockitoExtension
import org.openapitools.model.EntryCurrency
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.query.Query
import org.springframework.data.mongodb.core.query.isEqualTo
import org.springframework.http.HttpStatus
import org.springframework.test.context.ActiveProfiles
import java.math.BigDecimal
import java.time.LocalDate

@SpringBootTest
@ExtendWith(MockitoExtension::class)
@ActiveProfiles(value = ["test"])
class EntryControllerIntegrationTests(@Autowired val entryController: EntryController,
                                      @Autowired val entryDtoMapper: EntryDtoMapper,
                                      @Autowired val mongoTemplate: MongoTemplate) {

    @Test
    fun `creates, updates and deletes entry`(): Unit = runBlocking {
        val entry =
                EntryDomain(value = BigDecimal.valueOf(1), currency = EntryCurrency.EUR, name = "test entry", userId = "demo",
                    date = LocalDate.now()) // todo is this even correct?
        val entryDto = entryDtoMapper.toDto(entry)
        val response = entryController.addEntry(entryDto)
        assertEquals(HttpStatus.OK, response.statusCode)
        val savedId = response.body?.substringAfter("id ")?.trim('.') ?: ""

        val updatedEntry = entryDto.copy(name = "updated name")
        entryController.updateEntry(updatedEntry)
        assertEquals(
            mongoTemplate.find(Query().addCriteria(EntryDomain::name isEqualTo "updated name"), EntryDomain::class.java),
            listOf(entryDtoMapper.fromDto(updatedEntry)))

        val deleteResponse = entryController.deleteEntriesByIds(listOf(savedId))
        assertEquals(deleteResponse.body, "Entries with given ids have been deleted")
    }

}
