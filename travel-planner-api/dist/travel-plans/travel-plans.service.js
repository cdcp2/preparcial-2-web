"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TravelPlansService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const travel_plan_entity_1 = require("./entities/travel-plan.entity");
const countries_service_1 = require("../countries/countries.service");
let TravelPlansService = class TravelPlansService {
    travelPlansRepository;
    countriesService;
    constructor(travelPlansRepository, countriesService) {
        this.travelPlansRepository = travelPlansRepository;
        this.countriesService = countriesService;
    }
    async create(createTravelPlanDto) {
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
    findAll() {
        return this.travelPlansRepository.find({
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const travelPlan = await this.travelPlansRepository.findOne({
            where: { id },
        });
        if (!travelPlan) {
            throw new common_1.NotFoundException(`Travel plan with id ${id} was not found`);
        }
        return travelPlan;
    }
    validateDates(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
            throw new common_1.BadRequestException('Invalid travel plan dates provided');
        }
        if (start > end) {
            throw new common_1.BadRequestException('The end date must be greater than or equal to the start date');
        }
    }
};
exports.TravelPlansService = TravelPlansService;
exports.TravelPlansService = TravelPlansService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(travel_plan_entity_1.TravelPlan)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        countries_service_1.CountriesService])
], TravelPlansService);
//# sourceMappingURL=travel-plans.service.js.map