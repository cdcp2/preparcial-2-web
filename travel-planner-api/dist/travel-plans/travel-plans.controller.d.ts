import { TravelPlansService } from './travel-plans.service';
import { CreateTravelPlanDto } from './dto/create-travel-plan.dto';
import { TravelPlanResponseDto } from './dto/travel-plan-response.dto';
export declare class TravelPlansController {
    private readonly travelPlansService;
    constructor(travelPlansService: TravelPlansService);
    create(createTravelPlanDto: CreateTravelPlanDto): Promise<TravelPlanResponseDto>;
    findAll(): Promise<TravelPlanResponseDto[]>;
    findOne(id: string): Promise<TravelPlanResponseDto>;
}
