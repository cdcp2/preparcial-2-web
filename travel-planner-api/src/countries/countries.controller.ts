import { Controller, Delete, Get, HttpCode, Param, UseGuards } from '@nestjs/common';
import { CountriesService } from './countries.service';
import {
  CountryLookupResponseDto,
  CountryResponseDto,
} from './dto/country-response.dto';
import { DeleteCountryGuard } from './guards/delete-country.guard';

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

  @Delete(':code')
  @UseGuards(DeleteCountryGuard)
  @HttpCode(204)
  async remove(@Param('code') code: string): Promise<void> {
    await this.countriesService.deleteByAlpha3(code);
  }
}
