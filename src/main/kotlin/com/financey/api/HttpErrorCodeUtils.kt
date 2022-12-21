package com.financey.api

import arrow.core.Either
import com.financey.domain.error.ElementDoesNotExistError
import com.financey.domain.error.PersistenceError
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity

object HttpErrorCodeUtils {

    fun findHttpCodeForPersistenceError(deletionResult: Either.Left<PersistenceError>) = when (deletionResult.value) {
        is ElementDoesNotExistError -> ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body((deletionResult.value as ElementDoesNotExistError).message)
    }

}
