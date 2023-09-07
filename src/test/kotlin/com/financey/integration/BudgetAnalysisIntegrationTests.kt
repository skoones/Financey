package com.financey.integration;

import com.fasterxml.jackson.databind.ObjectMapper
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.openapitools.model.LoginRequestDTO
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.math.BigDecimal

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class BudgetAnalysisIntegrationTests(@Autowired val mockMvc: MockMvc) {

	private val jwtToken = obtainJwtToken()

	@Test
	fun `get expense balance by period and id successfully`() {
		val startDate = "2023-01-01"
		val endDate = "2023-12-31"
		val budgetId = "testBudgetId"

		val result = mockMvc.perform(get("/analysis/expenses/balance/$startDate/$endDate/$budgetId")
			.header("Authorization", "Bearer $jwtToken")
			.contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isOk)
			.andReturn()

		val balance = BigDecimal(result.response.contentAsString)
		assertEquals(BigDecimal("-50"), balance)
	}

	@Test
	fun `get expense sum by period and id successfully`() {
		val startDate = "2023-01-01"
		val endDate = "2023-12-31"
		val budgetId = "testBudgetId"

		val result = mockMvc.perform(get("/analysis/expenses/sum/$startDate/$endDate/$budgetId")
			.header("Authorization", "Bearer $jwtToken")
			.contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isOk)
			.andReturn()

		val balance = BigDecimal(result.response.contentAsString)
		assertEquals(BigDecimal("100"), balance)
	}

	private final fun obtainJwtToken(): String {
		val loginRequest = LoginRequestDTO("demoUser", "password")
		val result = mockMvc.perform(
			MockMvcRequestBuilders.post("/login")
			.contentType(MediaType.APPLICATION_JSON)
			.content(ObjectMapper().writeValueAsString(loginRequest)))
			.andExpect(status().isOk)
			.andReturn()

		val response = ObjectMapper().readValue(result.response.contentAsString, Map::class.java)
		return response["token"]?.toString() ?: throw RuntimeException("Token not found in login response")
	}

}

