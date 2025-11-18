import { CountriesService } from './countries.service';
import { CountryLookupResponseDto, CountryResponseDto } from './dto/country-response.dto';
export declare class CountriesController {
    private readonly countriesService;
    constructor(countriesService: CountriesService);
    findAll(): Promise<CountryResponseDto[]>;
    findByCode(code: string): Promise<CountryLookupResponseDto>;
}
