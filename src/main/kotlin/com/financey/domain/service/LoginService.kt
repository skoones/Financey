package com.financey.domain.service

import arrow.core.Either
import arrow.core.continuations.either
import com.financey.domain.error.BadCredentialsError
import com.financey.domain.error.FinanceyError
import com.financey.security.JwtService
import org.openapitools.model.LoginRequestDTO
import org.openapitools.model.LoginResponseDTO
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service

@Service
class LoginService(
    @Autowired private val authenticationManager: AuthenticationManager,
    @Autowired private val userService: UserService,
    @Autowired private val jwtService: JwtService
) {

    // todo domain login response/request
    suspend fun login(loginRequestDTO: LoginRequestDTO?): Either<FinanceyError, LoginResponseDTO> = either {
        try {
            val authentication = authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken(loginRequestDTO?.username, loginRequestDTO?.password)
            )
            SecurityContextHolder.getContext().authentication = authentication
        } catch (e: BadCredentialsException) { // todo
            Either.Left(BadCredentialsError(e.message))
        }

        val (userDetails, userId) = userService.findUserDetailsAndIdByUsername(loginRequestDTO?.username ?: "")
        val jwt = jwtService.generateToken(userDetails.username, userId)

        LoginResponseDTO(jwt)
    }

    fun logout(): String {
        SecurityContextHolder.getContext().authentication = null
        return "Logged out"
    }

}