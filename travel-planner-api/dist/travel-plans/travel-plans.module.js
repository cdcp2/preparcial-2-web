"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TravelPlansModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const travel_plan_entity_1 = require("./entities/travel-plan.entity");
const travel_plans_service_1 = require("./travel-plans.service");
const travel_plans_controller_1 = require("./travel-plans.controller");
const countries_module_1 = require("../countries/countries.module");
let TravelPlansModule = class TravelPlansModule {
};
exports.TravelPlansModule = TravelPlansModule;
exports.TravelPlansModule = TravelPlansModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([travel_plan_entity_1.TravelPlan]), countries_module_1.CountriesModule],
        controllers: [travel_plans_controller_1.TravelPlansController],
        providers: [travel_plans_service_1.TravelPlansService],
    })
], TravelPlansModule);
//# sourceMappingURL=travel-plans.module.js.map