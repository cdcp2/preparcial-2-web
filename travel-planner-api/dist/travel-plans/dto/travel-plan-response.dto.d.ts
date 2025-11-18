import { TravelPlan } from '../entities/travel-plan.entity';
import { CountryResponseDto } from '../../countries/dto/country-response.dto';
export declare class TravelPlanResponseDto {
    id: string;
    countryCode: string;
    title: string;
    startDate: string;
    endDate: string;
    notes?: string | null;
    createdAt: Date;
    country?: CountryResponseDto;
    static fromEntity(travelPlan: TravelPlan): TravelPlanResponseDto;
}
