package com.financey.api.mapper

import com.financey.domain.model.EntryDomain
import com.financey.domain.model.InvestmentEntryDomain
import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.mapstruct.Named
import org.openapitools.model.EntryDTO
import org.openapitools.model.InvestmentEntryDTO
import java.math.BigDecimal
import java.time.LocalDate

@Mapper(componentModel = "spring")
abstract class EntryDtoMapper {

    abstract fun fromDto(dto: EntryDTO): EntryDomain

    abstract fun toDto(domain: EntryDomain): EntryDTO

    @Mapping(source = "datesToMarketPrices", target = "datesToMarketPrices",
        qualifiedByName = ["mapDatesToMarketPrices"])
    abstract fun fromInvestmentDto(dto: InvestmentEntryDTO): InvestmentEntryDomain

    abstract fun toInvestmentDto(domain: InvestmentEntryDomain): InvestmentEntryDTO

    @Named("mapDatesToMarketPrices")
    fun mapDatesToMarketPrices(source: Map<String, BigDecimal>): Map<LocalDate, BigDecimal>  {
        return source.mapKeys { LocalDate.parse(it.key) }
    }

}
