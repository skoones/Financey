package com.financey.repository

import arrow.core.Either
import arrow.core.Either.Left
import arrow.core.Either.Right
import com.financey.domain.error.ElementDoesNotExistError
import com.financey.domain.error.PersistenceError
import com.financey.domain.model.Entry
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.query.Query
import org.springframework.data.mongodb.core.query.inValues
import org.springframework.data.mongodb.repository.MongoRepository

interface EntryRepository : MongoRepository<Entry, String>, CustomEntryRepository

interface CustomEntryRepository {
    fun deleteByIds(ids: List<String>): Either<PersistenceError, Unit>
}

class CustomEntryRepositoryImpl(
    @Autowired private val mongoTemplate: MongoTemplate
) : CustomEntryRepository {
    override fun deleteByIds(ids: List<String>): Either<PersistenceError, Unit> {
        val query = Query().addCriteria(Entry::id inValues ids)
        val existingEntries = mongoTemplate.find(query, Entry::class.java)

        return if (existingEntries.size != ids.size) {
            Left(ElementDoesNotExistError("Entry with at least one of the specified IDs could not be found."))
        } else {
            mongoTemplate.findAllAndRemove(query, Entry::class.java)
            Right(Unit)
        }
    }

}
