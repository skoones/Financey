package com.financey.domain.error

sealed class ArithmeticError : AnalysisError()

data class InvalidAmountError(override val message: String?) : ArithmeticError()
