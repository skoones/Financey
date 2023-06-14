package com.financey.domain.error

sealed class FinanceyError : Exception()

sealed class AnalysisError : FinanceyError()
