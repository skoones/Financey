package com.financey.api.controller

import com.financey.domain.service.LoginService
import kotlinx.coroutines.runBlocking
import org.openapitools.api.LoginApi
import org.openapitools.model.LoginRequestDTO
import org.openapitools.model.LoginResponseDTO
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.RestController

@RestController
@CrossOrigin
class LoginController(
    @Autowired private val loginService: LoginService
) : LoginApi {

    override fun login(loginRequestDTO: LoginRequestDTO?): ResponseEntity<LoginResponseDTO> {
        val loginResult = runBlocking {
            loginService.login(loginRequestDTO)
        }

        return loginResult.fold(
            { throw it },
            { ResponseEntity.ok(it) }
        )
    }

    override fun logout(): ResponseEntity<String> {
        return ResponseEntity.ok(loginService.logout())
    }

}