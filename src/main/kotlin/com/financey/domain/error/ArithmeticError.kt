package com.financey.domain.error

sealed class ArithmeticError : AnalysisError()

class InvalidAmountError(override val message: String?) : ArithmeticError()
