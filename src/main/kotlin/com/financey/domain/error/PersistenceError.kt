package com.financey.domain.error

sealed class PersistenceError : FinanceyError()

class ElementDoesNotExistError(override val message: String?) : PersistenceError()

class DataAccessError(override val message: String?) : PersistenceError()

class MultipleElementsError(override val message: String?) : PersistenceError()

