import { TravelPlan } from '../entities/travel-plan.entity';
import { CountryResponseDto } from '../../countries/dto/country-response.dto';

export class TravelPlanResponseDto {
  id: string;
  countryCode: string;
  title: string;
  startDate: string;
  endDate: string;
  notes?: string | null;
  createdAt: Date;
  country?: CountryResponseDto;

  static fromEntity(travelPlan: TravelPlan): TravelPlanResponseDto {
    return {
      id: travelPlan.id,
      countryCode: travelPlan.countryCode,
      title: travelPlan.title,
      startDate: travelPlan.startDate,
      endDate: travelPlan.endDate,
      notes: travelPlan.notes ?? null,
      createdAt: travelPlan.createdAt,
      country: travelPlan.country
        ? CountryResponseDto.fromEntity(travelPlan.country)
        : undefined,
    };
  }
}
