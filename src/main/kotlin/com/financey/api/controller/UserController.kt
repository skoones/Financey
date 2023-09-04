package com.financey.api.controller

import com.financey.api.mapper.UserDtoMapper
import com.financey.domain.service.UserService
import kotlinx.coroutines.runBlocking
import org.openapitools.api.UserApi
import org.openapitools.model.UserDTO
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.RestController

@RestController
@CrossOrigin
class UserController(
    @Autowired private val userService: UserService,
    @Autowired private val userDtoMapper: UserDtoMapper
) : UserApi {

    override fun addUser(userDTO: UserDTO?): ResponseEntity<Unit> {
        return super.addUser(userDTO)
    }

    override fun getByUsername(username: String): ResponseEntity<UserDTO> {
        val userResult = runBlocking {
            userService.getByUsername(username)
        }

        return userResult.fold(
            { throw it },
            { ResponseEntity.ok(userDtoMapper.toDto(it))}
        )
    }

}