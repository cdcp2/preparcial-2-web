import { Repository } from 'typeorm';
import { Country } from './entities/country.entity';
import type { CountryInformationProvider } from '../external/rest-countries/country-information.provider';
export type CountrySource = 'cache' | 'external';
export declare class CountriesService {
    private readonly countriesRepository;
    private readonly countryInformationProvider;
    constructor(countriesRepository: Repository<Country>, countryInformationProvider: CountryInformationProvider);
    findAll(): Promise<Country[]>;
    findByAlpha3(alpha3Code: string): Promise<{
        country: Country;
        source: CountrySource;
    }>;
    ensureCountryExists(alpha3Code: string): Promise<Country>;
    private normalizeCode;
}
