package com.financey.integration

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import org.junit.jupiter.api.Test
import org.openapitools.model.EntryCurrency
import org.openapitools.model.EntryDTO
import org.openapitools.model.EntryType
import org.openapitools.model.LoginRequestDTO
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.math.BigDecimal
import java.time.LocalDate
import java.time.Month

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class EntryIntegrationTests(@Autowired val mockMvc: MockMvc) {

    val jwtToken = obtainJwtToken()

    val objectMapper = ObjectMapper().apply {
        registerModule(JavaTimeModule())
    }

    @Test
    fun `user adds, updates and deletes a new entry successfully`() {
        // add
        val entryRequest = EntryDTO(
            value = BigDecimal(100.50),
            currency = EntryCurrency.PLN,
            name = "Groceries",
            userId = "demoUser",
            date = LocalDate.of(2023, Month.JULY, 1),
            entryType = EntryType.EXPENSE
        )

        val saveMessage = mockMvc.perform(post("/entry/add")
            .header("Authorization", "Bearer $jwtToken")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(entryRequest)))
            .andExpect(status().isOk)
            .andReturn().response.contentAsString

        val regex = "id (.*[^.])".toRegex()
        val matchResult = regex.find(saveMessage)
        val id = matchResult?.groups?.get(1)?.value

        // update
        val updateRequest = EntryDTO(
            id = id,
            value = BigDecimal(100.50),
            currency = EntryCurrency.PLN,
            name = "Updated name",
            userId = "demoUser",
            date = LocalDate.of(2023, Month.JULY, 1),
            entryType = EntryType.EXPENSE,
            budgetId = "testId"
        )

        mockMvc.perform(post("/entry/update")
            .header("Authorization", "Bearer $jwtToken")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(updateRequest)))
            .andExpect(status().isOk)
        mockMvc.perform(get("/entry/testId/entries")
            .header("Authorization", "Bearer $jwtToken")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].name").value("Updated name"))

        // delete
        mockMvc.perform(delete("/entry/delete/$id")
            .header("Authorization", "Bearer $jwtToken")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk)
    }

    private final fun obtainJwtToken(): String {
        val loginRequest = LoginRequestDTO("demoUser", "password")
        val result = mockMvc.perform(post("/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content(ObjectMapper().writeValueAsString(loginRequest)))
            .andExpect(status().isOk)
            .andReturn()

        val response = ObjectMapper().readValue(result.response.contentAsString, Map::class.java)
        return response["token"]?.toString() ?: throw RuntimeException("Token not found in login response")
    }

}
