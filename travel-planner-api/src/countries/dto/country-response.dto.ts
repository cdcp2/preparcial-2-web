import { Country } from '../entities/country.entity';
import { CountrySource } from '../countries.service';

export class CountryResponseDto {
  code: string;
  name: string;
  region: string;
  subregion: string;
  capital: string;
  population: number;
  flagUrl: string;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(country: Country): CountryResponseDto {
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

export class CountryLookupResponseDto extends CountryResponseDto {
  source: CountrySource;

  static fromLookup(
    country: Country,
    source: CountrySource,
  ): CountryLookupResponseDto {
    return {
      ...CountryResponseDto.fromEntity(country),
      source,
    };
  }
}
