package com.financey.repository

import arrow.core.Either
import arrow.core.Either.Left
import arrow.core.Either.Right
import com.financey.domain.db.model.Entry
import com.financey.domain.error.DataAccessError
import com.financey.domain.error.PersistenceError
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.dao.DataAccessException
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.query.Criteria
import org.springframework.data.mongodb.core.query.Query
import org.springframework.data.mongodb.core.query.inValues
import org.springframework.data.mongodb.core.query.isEqualTo
import org.springframework.data.mongodb.repository.MongoRepository

interface EntryRepository : MongoRepository<Entry, String>, CustomEntryRepository

interface CustomEntryRepository {
    fun save(entry: Entry): Either<Nothing, Entry>
    fun deleteByIds(ids: List<String>): Either<PersistenceError, Unit>
    fun getAllByBudgetId(budgetId: String): Either<PersistenceError, List<Entry>>
    fun getAllByBudgetIds(budgetIds: List<String?>): Either<PersistenceError, List<Entry>>
}

class CustomEntryRepositoryImpl(
    @Autowired private val mongoTemplate: MongoTemplate
) : CustomEntryRepository {

    override fun save(entry: Entry): Either<Nothing, Entry> = Right(mongoTemplate.save(entry))

    override fun deleteByIds(ids: List<String>): Either<PersistenceError, Unit> {
        val query = Query().addCriteria(Entry::id inValues ids)
        val existingEntries = mongoTemplate.find(query, Entry::class.java)

        return if (existingEntries.size != ids.size) {
            Left(DataAccessError("Entry with at least one of the specified ids could not be found."))
        } else {
            mongoTemplate.findAllAndRemove(query, Entry::class.java)
            Right(Unit)
        }
    }

    override fun getAllByBudgetId(budgetId: String): Either<PersistenceError, List<Entry>> {
        val query = Query().addCriteria(Entry::budgetId isEqualTo budgetId)

        return try {
            Right(mongoTemplate.find(query, Entry::class.java))
        } catch (e: DataAccessException) {
            Left(DataAccessError("There was an issue with accessing database data. Entries could not be found."))
        }
    }

    override fun getAllByBudgetIds(budgetIds: List<String?>): Either<PersistenceError, List<Entry>> {
        val query = Query().addCriteria(Criteria.where("budgetId").`in`(budgetIds))

        return try {
            Right(mongoTemplate.find(query, Entry::class.java))
        } catch (e: DataAccessException) {
            Left(DataAccessError("There was an issue with accessing database data. Entries could not be found."))
        }
    }

}
