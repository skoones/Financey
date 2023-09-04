package com.financey.security

import com.financey.domain.service.CustomUserDetailsService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.ProviderManager
import org.springframework.security.authentication.dao.DaoAuthenticationProvider
import org.springframework.security.config.Customizer.withDefaults
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

@Configuration
@EnableWebSecurity
class WebSecurityConfig {

    @Bean
    fun filterChain(http: HttpSecurity, @Autowired customUserDetailsService: CustomUserDetailsService,
                    @Autowired jwtService: JwtService): SecurityFilterChain {
        http
            .cors()
            .and()
            .csrf().disable()
            .authorizeHttpRequests { authz ->
                authz
                    .requestMatchers("/login").permitAll()
                    .anyRequest().authenticated()
            }
            .httpBasic(withDefaults())
            .addFilterBefore(JwtAuthorizationFilter(customUserDetailsService, jwtService), UsernamePasswordAuthenticationFilter::class.java)
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        return http.build()
    }

    @Bean
    fun passwordEncoder() = BCryptPasswordEncoder()



//    @Bean
//    fun userDetailsService(): InMemoryUserDetailsManager? {
//        val user: UserDetails = User.withUsername("user")
//            .password("{noop}password")
//            .roles("USER")
//            .build()
//        return InMemoryUserDetailsManager(user)
//    }

    @Bean
    fun authenticationManagerBean(@Autowired customUserDetailsService: CustomUserDetailsService): AuthenticationManager {
        return ProviderManager(listOf(DaoAuthenticationProvider().apply {
            setUserDetailsService(customUserDetailsService)
            setPasswordEncoder(passwordEncoder())
        }))
    }

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration = CorsConfiguration()
        configuration.allowedOrigins = listOf("http://localhost:4200") // Allow Angular dev server origin
        configuration.allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS")
        configuration.allowedHeaders = listOf("*")
        configuration.allowCredentials = true
        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", configuration)
        return source
    }

}


