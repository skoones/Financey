package com.financey.domain.service

import com.financey.repository.UserRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.stereotype.Service

@Service
class CustomUserDetailsService(
    @Autowired private val userRepository: UserRepository
) : UserDetailsService {

    override fun loadUserByUsername(username: String): UserDetails {
        return userRepository.getByUsername(username)
            .fold(
                { throw it },
                { User.withUsername(it.username)
                    .password(it.password)
                    .roles("USER")
                    .build() }
            )
    }

}