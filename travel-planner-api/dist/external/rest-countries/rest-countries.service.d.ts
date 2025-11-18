import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CountryInformationProvider, ExternalCountry } from './country-information.provider';
export declare class RestCountriesService implements CountryInformationProvider {
    private readonly httpService;
    private readonly logger;
    private readonly baseUrl;
    constructor(httpService: HttpService, configService: ConfigService);
    findByAlpha3(code: string): Promise<ExternalCountry | null>;
}
