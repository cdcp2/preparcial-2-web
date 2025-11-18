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
exports.TravelPlansController = void 0;
const common_1 = require("@nestjs/common");
const travel_plans_service_1 = require("./travel-plans.service");
const create_travel_plan_dto_1 = require("./dto/create-travel-plan.dto");
const travel_plan_response_dto_1 = require("./dto/travel-plan-response.dto");
let TravelPlansController = class TravelPlansController {
    travelPlansService;
    constructor(travelPlansService) {
        this.travelPlansService = travelPlansService;
    }
    async create(createTravelPlanDto) {
        const travelPlan = await this.travelPlansService.create(createTravelPlanDto);
        return travel_plan_response_dto_1.TravelPlanResponseDto.fromEntity(travelPlan);
    }
    async findAll() {
        const plans = await this.travelPlansService.findAll();
        return plans.map(travel_plan_response_dto_1.TravelPlanResponseDto.fromEntity);
    }
    async findOne(id) {
        const travelPlan = await this.travelPlansService.findOne(id);
        return travel_plan_response_dto_1.TravelPlanResponseDto.fromEntity(travelPlan);
    }
};
exports.TravelPlansController = TravelPlansController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_travel_plan_dto_1.CreateTravelPlanDto]),
    __metadata("design:returntype", Promise)
], TravelPlansController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TravelPlansController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TravelPlansController.prototype, "findOne", null);
exports.TravelPlansController = TravelPlansController = __decorate([
    (0, common_1.Controller)('travel-plans'),
    __metadata("design:paramtypes", [travel_plans_service_1.TravelPlansService])
], TravelPlansController);
//# sourceMappingURL=travel-plans.controller.js.map