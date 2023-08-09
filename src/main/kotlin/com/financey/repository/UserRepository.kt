package com.financey.repository

import arrow.core.Either
import com.financey.domain.db.model.User
import com.financey.domain.error.DataAccessError
import com.financey.domain.error.ElementDoesNotExistError
import com.financey.domain.error.MultipleElementsError
import com.financey.domain.error.PersistenceError
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.dao.DataAccessException
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.query.Query
import org.springframework.data.mongodb.core.query.isEqualTo
import org.springframework.data.mongodb.repository.MongoRepository

interface UserRepository : MongoRepository<User, String>, CustomUserRepository

interface CustomUserRepository {
    fun getById(id: String): Either<PersistenceError, User>
}

class CustomUserRepositoryImpl(
    @Autowired private val mongoTemplate: MongoTemplate
) : CustomUserRepository {

    override fun getById(id: String): Either<PersistenceError, User> {
        val query = Query().addCriteria(User::id isEqualTo  id)
        return try {
            val foundResult = mongoTemplate.find(query, User::class.java)
            when (foundResult.size) {
                0 -> Either.Left(ElementDoesNotExistError("There is no user with given id in the database."))
                1 -> Either.Right(foundResult.first())
                else -> Either.Left(MultipleElementsError("There is more than one user with given id in the database."))
            }
        } catch (e: DataAccessException) {
            Either.Left(DataAccessError("There was an issue with accessing database data. User could not be found."))
        }
    }

}
