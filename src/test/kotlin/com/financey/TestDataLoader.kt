package com.financey

import com.financey.data.BudgetAnalysisServiceTestData
import com.financey.domain.context.SubcategoryExpenseSumContext
import com.financey.domain.db.model.BudgetCategory
import com.financey.domain.model.EntryDomain
import java.math.BigDecimal

object TestDataLoader {

    fun loadMonthlyExpenseTestData(): List<List<EntryDomain>> = BudgetAnalysisServiceTestData.monthlyExpenseData

    fun loadCategoryToExpenseSumTestData():
            Pair<Map<BudgetCategory?, List<BigDecimal>>, List<SubcategoryExpenseSumContext>> =
            BudgetAnalysisServiceTestData.categoryToExpenseSumData to
                    BudgetAnalysisServiceTestData.categoryToExpenseSumResults

}
