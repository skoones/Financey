package com.financey.domain.service

import com.financey.domain.context.SubcategoryExpenseSumContext
import com.financey.domain.db.model.BudgetCategory
import com.financey.domain.model.EntryDomain
import com.financey.utils.CommonUtils
import org.openapitools.model.EntryType
import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.time.LocalDate

@Service
class ExpenseCalculatorService {
    fun findExpenseSumForPeriodFromEntries(
        entries: List<EntryDomain>,
        startDate: LocalDate,
        endDate: LocalDate
    ): BigDecimal = entries
        .filter {
            (it.date ?: LocalDate.MIN) >= startDate && (it.date ?: LocalDate.MAX) <= endDate
        }
        .filter { it.entryType == EntryType.EXPENSE }
        // todo take currency into consideration
        .map { it.value }
        .reduceOrNull { a, b -> a.plus(b) } ?: BigDecimal.ZERO

    fun findBalanceForPeriodFromEntries(
        entries: List<EntryDomain>,
        startDate: LocalDate,
        endDate: LocalDate
    ): BigDecimal = entries
        .filter {
            (it.date ?: LocalDate.MIN) >= startDate && (it.date ?: LocalDate.MAX) <= endDate
        }
        // todo take currency into consideration
        .map { if (it.entryType == EntryType.EXPENSE) it.value.negate() else it.value }
        .reduceOrNull { a, b -> a.plus(b) } ?: BigDecimal.ZERO

    fun findExpenseSumContexts(subcategoryToExpenseSum: Map<BudgetCategory?, List<BigDecimal>>) =
        subcategoryToExpenseSum
            .mapValues { it.value.fold(BigDecimal.ZERO, BigDecimal::add) }
            .map { (subcategory, expenseSum) ->
                subcategory?.let { category ->
                    SubcategoryExpenseSumContext(
                        subcategoryId = CommonUtils.objectIdToString(category.id),
                        subcategoryName = category.name,
                        expenseSum = expenseSum
                    )
                } ?: SubcategoryExpenseSumContext(
                    subcategoryId = "",
                    subcategoryName = ""
                )
            }
}