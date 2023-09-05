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
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service

@Service
class UserService(
    @Autowired private val userRepository: UserRepository,
    @Autowired private val userDomainMapper: UserDomainMapper,
    @Autowired private val passwordEncoder: BCryptPasswordEncoder
) {

    private val logger: KLogger = KotlinLogging.logger {}

    suspend fun getByUsername(username: String): Either<PersistenceError, UserDomain> = either {
        val user = userRepository.getByUsername(username).bind().let {
            userDomainMapper.toDomain(it)
        }
        logger.debug { "Retrieved user with username $username." }
        user
    }

    fun findUserDetailsAndIdByUsername(username: String): Pair<UserDetails, String> {
        return userRepository.getByUsername(username)
            .fold(
                { throw it },
                { User.withUsername(it.username)
                    .password(it.password)
                    .roles("USER")
                    .build() to (it.id?.toString() ?: "") }
            )
    }

    suspend fun save(user: UserDomain): Either<PersistenceError, Unit> = either {
        val userWithHashedPassword = user.copy(password = passwordEncoder.encode(user.password))
        userRepository.save(userDomainMapper.fromDomain(userWithHashedPassword)).bind()
    }

}
