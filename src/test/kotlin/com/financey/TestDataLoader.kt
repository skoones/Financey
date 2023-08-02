package com.financey

import com.financey.data.BudgetAnalysisServiceTestData
import com.financey.domain.db.model.Entry

object TestDataLoader {

    fun loadMonthlyExpenseTestData(): List<List<Entry>> {
        return BudgetAnalysisServiceTestData.monthlyExpenseData
    }

}
