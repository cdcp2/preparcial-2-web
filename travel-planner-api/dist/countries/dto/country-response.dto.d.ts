import { Country } from '../entities/country.entity';
import { CountrySource } from '../countries.service';
export declare class CountryResponseDto {
    code: string;
    name: string;
    region: string;
    subregion: string;
    capital: string;
    population: number;
    flagUrl: string;
    createdAt: Date;
    updatedAt: Date;
    static fromEntity(country: Country): CountryResponseDto;
}
export declare class CountryLookupResponseDto extends CountryResponseDto {
    source: CountrySource;
    static fromLookup(country: Country, source: CountrySource): CountryLookupResponseDto;
}
