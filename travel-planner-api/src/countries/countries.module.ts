import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { RestCountriesModule } from '../external/rest-countries/rest-countries.module';
import { TravelPlan } from '../travel-plans/entities/travel-plan.entity';
import { DeleteCountryGuard } from './guards/delete-country.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Country, TravelPlan]), RestCountriesModule],
  controllers: [CountriesController],
  providers: [CountriesService, DeleteCountryGuard],
  exports: [CountriesService],
})
export class CountriesModule {}
