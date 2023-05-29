package com.financey.repository

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.mongodb.MongoDatabaseFactory
import org.springframework.data.mongodb.MongoTransactionManager
import org.springframework.transaction.annotation.EnableTransactionManagement

@Configuration
@EnableTransactionManagement
class MongoConfig {

    @Bean
    fun transactionManager(databaseFactory: MongoDatabaseFactory): MongoTransactionManager {
        return MongoTransactionManager(databaseFactory)
    }

}
