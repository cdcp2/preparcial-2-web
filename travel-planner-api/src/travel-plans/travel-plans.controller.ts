import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TravelPlansService } from './travel-plans.service';
import { CreateTravelPlanDto } from './dto/create-travel-plan.dto';
import { TravelPlanResponseDto } from './dto/travel-plan-response.dto';

@Controller('travel-plans')
export class TravelPlansController {
  constructor(private readonly travelPlansService: TravelPlansService) {}

  @Post()
  async create(
    @Body() createTravelPlanDto: CreateTravelPlanDto,
  ): Promise<TravelPlanResponseDto> {
    const travelPlan = await this.travelPlansService.create(
      createTravelPlanDto,
    );
    return TravelPlanResponseDto.fromEntity(travelPlan);
  }

  @Get()
  async findAll(): Promise<TravelPlanResponseDto[]> {
    const plans = await this.travelPlansService.findAll();
    return plans.map(TravelPlanResponseDto.fromEntity);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TravelPlanResponseDto> {
    const travelPlan = await this.travelPlansService.findOne(id);
    return TravelPlanResponseDto.fromEntity(travelPlan);
  }
}
