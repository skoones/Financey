package com.financey.domain.service

import com.financey.repository.UserRepository
import mu.KLogger
import mu.KotlinLogging
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class UserService(
    @Autowired private val userRepository: UserRepository
) {
    private val logger: KLogger = KotlinLogging.logger {}

}
