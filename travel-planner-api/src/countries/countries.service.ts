import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './entities/country.entity';
import { COUNTRY_INFORMATION_PROVIDER } from '../external/rest-countries/country-information.provider';
import type { CountryInformationProvider } from '../external/rest-countries/country-information.provider';

export type CountrySource = 'cache' | 'external';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Country)
    private readonly countriesRepository: Repository<Country>,
    @Inject(COUNTRY_INFORMATION_PROVIDER)
    private readonly countryInformationProvider: CountryInformationProvider,
  ) {}

  findAll(): Promise<Country[]> {
    return this.countriesRepository.find({
      order: {
        name: 'ASC',
      },
    });
  }

  async findByAlpha3(
    alpha3Code: string,
  ): Promise<{ country: Country; source: CountrySource }> {
    const normalizedCode = this.normalizeCode(alpha3Code);
    const cachedCountry = await this.countriesRepository.findOne({
      where: { code: normalizedCode },
    });

    if (cachedCountry) {
      return { country: cachedCountry, source: 'cache' };
    }

    const externalCountry =
      await this.countryInformationProvider.findByAlpha3(normalizedCode);

    if (!externalCountry) {
      throw new NotFoundException(
        `Country with code ${normalizedCode} was not found`,
      );
    }

    const newCountry = this.countriesRepository.create({
      code: normalizedCode,
      name: externalCountry.name,
      region: externalCountry.region,
      subregion: externalCountry.subregion,
      capital: externalCountry.capital,
      population: externalCountry.population,
      flagUrl: externalCountry.flagUrl,
    });

    const savedCountry = await this.countriesRepository.save(newCountry);
    return { country: savedCountry, source: 'external' };
  }

  async ensureCountryExists(alpha3Code: string): Promise<Country> {
    const result = await this.findByAlpha3(alpha3Code);
    return result.country;
  }

  private normalizeCode(code: string): string {
    return code.trim().toUpperCase();
  }
}
