package com.financey.domain.error

sealed class PersistenceError : Exception()

class ElementDoesNotExistError(override val message: String?) : PersistenceError()

class DataAccessError(override val message: String?) : PersistenceError()

