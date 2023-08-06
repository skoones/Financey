package com.financey

import com.financey.data.BudgetAnalysisServiceTestData
import com.financey.domain.model.EntryDomain

object TestDataLoader {

    fun loadMonthlyExpenseTestData(): List<List<EntryDomain>> {
        return BudgetAnalysisServiceTestData.monthlyExpenseData
    }

}
