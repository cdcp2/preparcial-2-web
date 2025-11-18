import { Controller, Get, Param } from '@nestjs/common';
import { CountriesService } from './countries.service';
import {
  CountryLookupResponseDto,
  CountryResponseDto,
} from './dto/country-response.dto';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  async findAll(): Promise<CountryResponseDto[]> {
    const countries = await this.countriesService.findAll();
    return countries.map(CountryResponseDto.fromEntity);
  }

  @Get(':code')
  async findByCode(
    @Param('code') code: string,
  ): Promise<CountryLookupResponseDto> {
    const result = await this.countriesService.findByAlpha3(code);
    return CountryLookupResponseDto.fromLookup(result.country, result.source);
  }
}
