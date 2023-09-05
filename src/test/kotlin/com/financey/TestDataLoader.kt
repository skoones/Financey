package com.financey

import com.financey.data.BudgetAnalysisServiceTestData
import com.financey.data.ProfitCalculatorTestData
import com.financey.domain.model.SubcategoryExpenseSumDomain
import com.financey.domain.db.model.BudgetCategory
import com.financey.domain.model.EntryDomain
import com.financey.domain.model.InvestmentEntryDomain

object TestDataLoader {

    fun loadMonthlyExpenseTestData(): List<List<EntryDomain>> = BudgetAnalysisServiceTestData.monthlyExpenseData

    fun loadCategoryToExpenseSumTestData():
            Pair<Map<BudgetCategory?, List<EntryDomain>>, List<SubcategoryExpenseSumDomain>> =
            BudgetAnalysisServiceTestData.categoryToExpenseSumData to
                    BudgetAnalysisServiceTestData.categoryToExpenseSumResults

    fun loadProfitByPeriodTestData(): List<InvestmentEntryDomain> = ProfitCalculatorTestData.profitTestData

}
