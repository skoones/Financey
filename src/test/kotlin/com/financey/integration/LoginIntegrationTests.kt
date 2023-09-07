package com.financey.integration

import com.fasterxml.jackson.databind.ObjectMapper
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.openapitools.model.LoginRequestDTO
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class LoginIntegrationTests(@Autowired val mockMvc: MockMvc) {

    @Test
    fun `user logs into the application successfully`() {
        val loginRequest = LoginRequestDTO("demoUser", "password")
        val result = mockMvc.perform(post("/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content(ObjectMapper().writeValueAsString(loginRequest)))
            .andExpect(status().isOk)
            .andReturn()

        val response = result.response.contentAsString
        assertTrue(response.contains("token"))
    }

    @Test
    fun `user fails to log into the application with invalid credentials`() {
        val loginRequest = LoginRequestDTO("demoUser", "invalid")
        mockMvc.perform(post("/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content(ObjectMapper().writeValueAsString(loginRequest)))
            .andExpect(status().isUnauthorized)
    }

}
