package com.financey.security

// JwtAuthorizationFilter.kt

import com.financey.domain.service.CustomUserDetailsService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class JwtAuthorizationFilter(
    private val userDetailsService: CustomUserDetailsService,
    @Autowired private val jwtService: JwtService
) : OncePerRequestFilter() {

    override fun doFilterInternal(request: jakarta.servlet.http.HttpServletRequest,
                                  response: jakarta.servlet.http.HttpServletResponse,
                                  filterChain: jakarta.servlet.FilterChain) {
        val header = request.getHeader("Authorization")

        if (header != null && header.startsWith("Bearer ")) {
            val token = header.substring(7)
            val username = jwtService.validateToken(token)

            if (username != null && SecurityContextHolder.getContext().authentication == null) {
                val userDetails = userDetailsService.loadUserByUsername(username)
                val authentication = UsernamePasswordAuthenticationToken(userDetails, null, userDetails.authorities)
                authentication.details = WebAuthenticationDetailsSource().buildDetails(request)
                SecurityContextHolder.getContext().authentication = authentication
            }
        }

        filterChain.doFilter(request, response)
    }

}
