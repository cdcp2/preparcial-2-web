import { Country } from '../../countries/entities/country.entity';
export declare class TravelPlan {
    id: string;
    countryCode: string;
    title: string;
    startDate: string;
    endDate: string;
    notes?: string | null;
    createdAt: Date;
    country: Country;
}
