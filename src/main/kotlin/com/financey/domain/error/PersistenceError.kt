package com.financey.domain.error

sealed class PersistenceError : FinanceyError()

data class ElementDoesNotExistError(override val message: String?) : PersistenceError()

data class UniqueElementExistsError(override val message: String?) : PersistenceError()

data class DataAccessError(override val message: String?) : PersistenceError()

data class MultipleElementsError(override val message: String?) : PersistenceError()

