import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { COUNTRY_INFORMATION_PROVIDER } from './country-information.provider';
import { RestCountriesService } from './rest-countries.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [
    {
      provide: COUNTRY_INFORMATION_PROVIDER,
      useClass: RestCountriesService,
    },
  ],
  exports: [COUNTRY_INFORMATION_PROVIDER],
})
export class RestCountriesModule {}
