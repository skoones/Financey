package com.financey.domain.error

sealed class LoginError : FinanceyError()

data class BadCredentialsError(override val message: String?) : LoginError()


