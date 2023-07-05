package com.financey

import com.financey.data.BudgetAnalysisServiceTestData
import com.financey.domain.model.Entry
import java.math.BigDecimal

object TestDataLoader {

    fun loadMonthlyExpenseTestData(): List<Pair<List<Entry>, BigDecimal>> {
        return BudgetAnalysisServiceTestData.monthlyExpenseData
    }

}
