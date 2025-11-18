import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TravelPlan } from './entities/travel-plan.entity';
import { CreateTravelPlanDto } from './dto/create-travel-plan.dto';
import { CountriesService } from '../countries/countries.service';

@Injectable()
export class TravelPlansService {
  constructor(
    @InjectRepository(TravelPlan)
    private readonly travelPlansRepository: Repository<TravelPlan>,
    private readonly countriesService: CountriesService,
  ) {}

  async create(createTravelPlanDto: CreateTravelPlanDto): Promise<TravelPlan> {
    const normalizedCode = createTravelPlanDto.countryCode.trim().toUpperCase();
    this.validateDates(createTravelPlanDto.startDate, createTravelPlanDto.endDate);

    await this.countriesService.ensureCountryExists(normalizedCode);

    const travelPlan = this.travelPlansRepository.create({
      countryCode: normalizedCode,
      title: createTravelPlanDto.title,
      startDate: createTravelPlanDto.startDate,
      endDate: createTravelPlanDto.endDate,
      notes: createTravelPlanDto.notes,
    });

    const savedPlan = await this.travelPlansRepository.save(travelPlan);
    return this.findOne(savedPlan.id);
  }

  findAll(): Promise<TravelPlan[]> {
    return this.travelPlansRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<TravelPlan> {
    const travelPlan = await this.travelPlansRepository.findOne({
      where: { id },
    });

    if (!travelPlan) {
      throw new NotFoundException(`Travel plan with id ${id} was not found`);
    }

    return travelPlan;
  }

  private validateDates(startDate: string, endDate: string): void {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      throw new BadRequestException('Invalid travel plan dates provided');
    }

    if (start > end) {
      throw new BadRequestException(
        'The end date must be greater than or equal to the start date',
      );
    }
  }
}
