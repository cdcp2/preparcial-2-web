import { Repository } from 'typeorm';
import { Country } from './entities/country.entity';
import type { CountryInformationProvider } from '../external/rest-countries/country-information.provider';
import { TravelPlan } from '../travel-plans/entities/travel-plan.entity';
export type CountrySource = 'cache' | 'external';
export declare class CountriesService {
    private readonly countriesRepository;
    private readonly travelPlansRepository;
    private readonly countryInformationProvider;
    constructor(countriesRepository: Repository<Country>, travelPlansRepository: Repository<TravelPlan>, countryInformationProvider: CountryInformationProvider);
    findAll(): Promise<Country[]>;
    findByAlpha3(alpha3Code: string): Promise<{
        country: Country;
        source: CountrySource;
    }>;
    ensureCountryExists(alpha3Code: string): Promise<Country>;
    deleteByAlpha3(alpha3Code: string): Promise<void>;
    private normalizeCode;
}
