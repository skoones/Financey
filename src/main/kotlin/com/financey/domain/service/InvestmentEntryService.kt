package com.financey.domain.service

import arrow.core.Either
import arrow.core.continuations.either
import com.financey.domain.error.PersistenceError
import com.financey.domain.mapper.BudgetDomainMapper
import com.financey.domain.mapper.EntryDomainMapper
import com.financey.domain.model.InvestmentEntryDomain
import com.financey.repository.InvestmentEntryRepository
import mu.KotlinLogging
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class InvestmentEntryService(
    private val investmentEntryRepository: InvestmentEntryRepository,
    @Autowired private val entryDomainMapper: EntryDomainMapper
) {

    private val logger = KotlinLogging.logger {}

    suspend fun save(entry: InvestmentEntryDomain): Either<Nothing, InvestmentEntryDomain> = either {
        val savedEntry = investmentEntryRepository.save(entryDomainMapper.fromInvestmentDomain(entry)).bind()
        val savedEntryDomain = entryDomainMapper.toInvestmentDomain(savedEntry)
        logger.debug { "Saved $savedEntry to database" }
        savedEntryDomain
    }

    suspend fun getAllByBudgetId(budgetId: String): Either<PersistenceError, List<InvestmentEntryDomain>> = either {
        val entries = investmentEntryRepository.getAllByBudgetId(budgetId).bind()
            .map { entryDomainMapper.toInvestmentDomain(it) }
        logger.debug { "Retrieved investment entries for budget id $budgetId from database" }
        entries
    }

}