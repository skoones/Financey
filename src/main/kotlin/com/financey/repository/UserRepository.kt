package com.financey.repository

import arrow.core.Either
import com.financey.domain.db.model.User
import com.financey.domain.error.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.dao.DataAccessException
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.query.Query
import org.springframework.data.mongodb.core.query.isEqualTo
import org.springframework.data.mongodb.repository.MongoRepository

interface UserRepository : MongoRepository<User, String>, CustomUserRepository

interface CustomUserRepository {
    fun save(user: User): Either<PersistenceError, User>
    fun getById(id: String): Either<PersistenceError, User>
    fun getByUsername(username: String): Either<PersistenceError, User>

}

class CustomUserRepositoryImpl(
    @Autowired private val mongoTemplate: MongoTemplate
) : CustomUserRepository {
    override fun save(user: User): Either<PersistenceError, User> = getByUsername(user.username)
    .fold({ e ->
        when (e) {
            is ElementDoesNotExistError -> Either.Right(mongoTemplate.save(user))
            else -> Either.Left(e)
        }
    },
    {
        Either.Left(UniqueElementExistsError("User with this username is already registered."))
    })

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

    override fun getByUsername(username: String): Either<PersistenceError, User> {
        val query = Query().addCriteria(User::username isEqualTo username)

        return try {
            val existingUsers = mongoTemplate.find(query, User::class.java)
            when (existingUsers.size) {
                0 -> Either.Left(ElementDoesNotExistError("There is no user with the given username in the database."))
                1 -> Either.Right(existingUsers.first())
                else -> Either.Left(MultipleElementsError("Multiple users with given name have been found."))
            }
        } catch (e: DataAccessException) {
            Either.Left(DataAccessError("There was an issue with accessing database data. User could not be found."))
        }
    }

}
