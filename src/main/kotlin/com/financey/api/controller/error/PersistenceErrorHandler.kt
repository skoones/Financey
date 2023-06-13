package com.financey.api.controller.error

import com.financey.domain.error.DataAccessError
import com.financey.domain.error.ElementDoesNotExistError
import com.financey.domain.error.UniqueElementExistsError
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.ResponseStatus

@ControllerAdvice
class PersistenceErrorHandler {

    @ExceptionHandler(ElementDoesNotExistError::class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ResponseBody
    fun handleElementDoesNotExistError(e: ElementDoesNotExistError) = e.message

    @ExceptionHandler(UniqueElementExistsError::class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    fun handleUniqueElementExistsError(e: UniqueElementExistsError) = e.message

    @ExceptionHandler(DataAccessError::class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ResponseBody
    fun handleDataAccessError(e: DataAccessError) = e.message

}

