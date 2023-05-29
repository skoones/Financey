package com.financey.repository

import arrow.core.Either
import com.financey.domain.error.DataAccessError
import com.financey.domain.error.PersistenceError
import com.financey.domain.model.Entry
import com.financey.domain.model.InvestmentEntry
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.dao.DataAccessException
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.query.Criteria
import org.springframework.data.mongodb.core.query.Query
import org.springframework.data.mongodb.core.query.inValues
import org.springframework.data.mongodb.repository.MongoRepository

interface InvestmentEntryRepository : MongoRepository<Entry, String>, CustomInvestmentEntryRepository

interface CustomInvestmentEntryRepository {
    fun save(entry: InvestmentEntry): Either<Nothing, InvestmentEntry>
    fun deleteByIds(ids: List<String>): Either<PersistenceError, Unit>
    fun getAllByBudgetId(budgetId: String): Either<PersistenceError, List<InvestmentEntry>>
}

class CustomInvestmentEntryRepositoryImpl(
    @Autowired private val mongoTemplate: MongoTemplate
) : CustomInvestmentEntryRepository {

    override fun save(entry: InvestmentEntry): Either<Nothing, InvestmentEntry> = Either.Right(mongoTemplate.save(entry))

    override fun deleteByIds(ids: List<String>): Either<PersistenceError, Unit> {
        val query = Query().addCriteria(InvestmentEntry::id inValues ids)
        val existingEntries = mongoTemplate.find(query, InvestmentEntry::class.java)

        return if (existingEntries.size != ids.size) {
            Either.Left(DataAccessError("InvestmentEntry with at least one of the specified ids could not be found."))
        } else {
            mongoTemplate.findAllAndRemove(query, InvestmentEntry::class.java)
            Either.Right(Unit)
        }
    }

    override fun getAllByBudgetId(budgetId: String): Either<PersistenceError, List<InvestmentEntry>> {
        val query = Query().addCriteria(Criteria.where("entry.budgetId").`is`(budgetId))

        return try {
            Either.Right(mongoTemplate.find(query, InvestmentEntry::class.java))
        } catch (e: DataAccessException) {
            Either.Left(DataAccessError("There was an issue with accessing database data. Entries could not be found."))
        }
    }

}