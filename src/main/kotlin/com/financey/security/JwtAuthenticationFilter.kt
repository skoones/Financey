package com.financey.security

//@Component
//class JwtAuthenticationFilter(
//    authManager: AuthenticationManager,
//    @Autowired private val jwtService: JwtService
//) : UsernamePasswordAuthenticationFilter() {
//
//    init {
//        authenticationManager = authManager
//        setFilterProcessesUrl("/login")
//    }
//
//    override fun attemptAuthentication(request: HttpServletRequest, response: HttpServletResponse): Authentication {
//        val username = obtainUsername(request)
//        val password = obtainPassword(request)
//        val authenticationToken = UsernamePasswordAuthenticationToken(username, password)
//        return authenticationManager.authenticate(authenticationToken)
//    }
//
//    override fun successfulAuthentication(request: HttpServletRequest, response: HttpServletResponse,
//                                          chain: FilterChain, authResult: Authentication) {
//        val user = authResult.principal as org.springframework.security.core.userdetails.User
//        val token = jwtService.generateToken(user.username)
//        response.addHeader("Authorization", "Bearer $token")
//    }
//
//}

