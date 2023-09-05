package com.financey.api.controller

import com.financey.domain.service.UserService
import com.financey.security.JwtService
import mu.KLogger
import mu.KotlinLogging
import org.openapitools.api.LoginApi
import org.openapitools.model.LoginRequestDTO
import org.openapitools.model.LoginResponseDTO
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.RestController

@RestController
@CrossOrigin
class LoginController(
    @Autowired private val authenticationManager: AuthenticationManager,
    @Autowired private val userService: UserService,
    @Autowired private val jwtService: JwtService
) : LoginApi {

    private val logger: KLogger = KotlinLogging.logger {}

    override fun login(loginRequestDTO: LoginRequestDTO?): ResponseEntity<LoginResponseDTO> {
        // todo service?
        try {
            val authentication = authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken(loginRequestDTO?.username, loginRequestDTO?.password)
            )
            SecurityContextHolder.getContext().authentication = authentication
        } catch (e: BadCredentialsException) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()
        }

        val (userDetails, userId) = userService.findUserDetailsAndIdByUsername(loginRequestDTO?.username ?: "")
        val jwt = jwtService.generateToken(userDetails.username, userId)

        return ResponseEntity.ok(LoginResponseDTO(jwt))
    }

    override fun logout(): ResponseEntity<String> {
        SecurityContextHolder.getContext().authentication = null
        logger.info { "Logged out" }
        return ResponseEntity.ok("Logged out")
    }

}