import { Repository } from 'typeorm';
import { TravelPlan } from './entities/travel-plan.entity';
import { CreateTravelPlanDto } from './dto/create-travel-plan.dto';
import { CountriesService } from '../countries/countries.service';
export declare class TravelPlansService {
    private readonly travelPlansRepository;
    private readonly countriesService;
    constructor(travelPlansRepository: Repository<TravelPlan>, countriesService: CountriesService);
    create(createTravelPlanDto: CreateTravelPlanDto): Promise<TravelPlan>;
    findAll(): Promise<TravelPlan[]>;
    findOne(id: string): Promise<TravelPlan>;
    private validateDates;
}
