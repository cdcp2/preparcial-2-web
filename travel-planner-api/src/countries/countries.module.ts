import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { RestCountriesModule } from '../external/rest-countries/rest-countries.module';

@Module({
  imports: [TypeOrmModule.forFeature([Country]), RestCountriesModule],
  controllers: [CountriesController],
  providers: [CountriesService],
  exports: [CountriesService],
})
export class CountriesModule {}
