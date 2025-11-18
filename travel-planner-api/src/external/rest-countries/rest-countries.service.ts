import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import {
  COUNTRY_INFORMATION_PROVIDER,
  CountryInformationProvider,
  ExternalCountry,
} from './country-information.provider';

@Injectable()
export class RestCountriesService implements CountryInformationProvider {
  private readonly logger = new Logger(RestCountriesService.name);
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    configService: ConfigService,
  ) {
    this.baseUrl =
      configService.get<string>('REST_COUNTRIES_BASE_URL') ??
      'https://restcountries.com/v3.1';
  }

  async findByAlpha3(code: string): Promise<ExternalCountry | null> {
    const normalizedCode = code.toUpperCase();
    const url = `${this.baseUrl}/alpha/${normalizedCode}`;

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          params: {
            fields:
              'cca3,name,region,subregion,capital,population,flags',
          },
        }),
      );

      const rawCountry = Array.isArray(response.data)
        ? response.data[0]
        : response.data;

      if (!rawCountry) {
        return null;
      }

      return {
        code: rawCountry.cca3,
        name: rawCountry.name?.common ?? '',
        region: rawCountry.region ?? '',
        subregion: rawCountry.subregion ?? '',
        capital: Array.isArray(rawCountry.capital)
          ? rawCountry.capital[0] ?? ''
          : rawCountry.capital ?? '',
        population: rawCountry.population ?? 0,
        flagUrl:
          rawCountry.flags?.svg ??
          rawCountry.flags?.png ??
          rawCountry.flag ??
          '',
      };
    } catch (error) {
      const status = error?.response?.status;
      if (status === 404) {
        return null;
      }

      this.logger.error(
        `Failed to fetch country ${normalizedCode} from RestCountries`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }
}
