package com.financey.repository

import com.financey.domain.model.Entry
import org.springframework.data.mongodb.repository.MongoRepository

interface EntryRepository : MongoRepository<Entry, String> {
}
