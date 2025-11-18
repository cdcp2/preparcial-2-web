"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryLookupResponseDto = exports.CountryResponseDto = void 0;
class CountryResponseDto {
    code;
    name;
    region;
    subregion;
    capital;
    population;
    flagUrl;
    createdAt;
    updatedAt;
    static fromEntity(country) {
        return {
            code: country.code,
            name: country.name,
            region: country.region,
            subregion: country.subregion,
            capital: country.capital,
            population: country.population,
            flagUrl: country.flagUrl,
            createdAt: country.createdAt,
            updatedAt: country.updatedAt,
        };
    }
}
exports.CountryResponseDto = CountryResponseDto;
class CountryLookupResponseDto extends CountryResponseDto {
    source;
    static fromLookup(country, source) {
        return {
            ...CountryResponseDto.fromEntity(country),
            source,
        };
    }
}
exports.CountryLookupResponseDto = CountryLookupResponseDto;
//# sourceMappingURL=country-response.dto.js.map