package com.financey.api.controller.error

import com.financey.domain.error.BadCredentialsError
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.ResponseStatus

@ControllerAdvice
class LoginErrorHandler {

    @ExceptionHandler(BadCredentialsError::class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ResponseBody
    fun handleBadCredentialsError(e: BadCredentialsError) = e.message

}