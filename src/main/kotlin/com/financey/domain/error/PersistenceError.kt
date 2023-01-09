package com.financey.domain.error

sealed interface PersistenceError

@JvmInline
value class ElementDoesNotExistError(val message: String?) : PersistenceError
