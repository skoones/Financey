package com.financey.domain.service

import arrow.core.Either
import arrow.core.continuations.either
import com.financey.domain.error.PersistenceError
import com.financey.domain.mapper.UserDomainMapper
import com.financey.domain.model.UserDomain
import com.financey.repository.UserRepository
import mu.KLogger
import mu.KotlinLogging
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class UserService(
    @Autowired private val userRepository: UserRepository,
    @Autowired private val userDomainMapper: UserDomainMapper
) {

    private val logger: KLogger = KotlinLogging.logger {}

    suspend fun getByUsername(username: String): Either<PersistenceError, UserDomain> = either {
        val user = userRepository.getByUsername(username).bind().let {
            userDomainMapper.toDomain(it)
        }
        logger.debug { "Retrieved user with username $username." }
        user
    }


}
