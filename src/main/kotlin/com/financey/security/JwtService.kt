package com.financey.security

import com.financey.constants.SecurityConstants
import com.financey.properties.JwtProperties
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.util.*
import javax.crypto.SecretKey

@Service
class JwtService(
    @Autowired private val jwtProperties: JwtProperties
) {

    fun generateToken(username: String): String {
        return Jwts.builder()
            .setSubject(username)
            .setExpiration(Date(System.currentTimeMillis() + SecurityConstants.JWT_EXPIRATION_TIME))
            .signWith(stringToKey(jwtProperties.secretKey))
            .compact()
    }

    fun validateToken(token: String): String? {
        return Jwts.parserBuilder()
            .setSigningKey(stringToKey(jwtProperties.secretKey))
            .build()
            .parseClaimsJws(token)
            .body
            .subject
    }

    private fun stringToKey(keyString: String): SecretKey = Keys.hmacShaKeyFor(keyString.toByteArray())

}
