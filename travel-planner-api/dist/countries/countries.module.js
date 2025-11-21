"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountriesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const country_entity_1 = require("./entities/country.entity");
const countries_service_1 = require("./countries.service");
const countries_controller_1 = require("./countries.controller");
const rest_countries_module_1 = require("../external/rest-countries/rest-countries.module");
const travel_plan_entity_1 = require("../travel-plans/entities/travel-plan.entity");
const delete_country_guard_1 = require("./guards/delete-country.guard");
let CountriesModule = class CountriesModule {
};
exports.CountriesModule = CountriesModule;
exports.CountriesModule = CountriesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([country_entity_1.Country, travel_plan_entity_1.TravelPlan]), rest_countries_module_1.RestCountriesModule],
        controllers: [countries_controller_1.CountriesController],
        providers: [countries_service_1.CountriesService, delete_country_guard_1.DeleteCountryGuard],
        exports: [countries_service_1.CountriesService],
    })
], CountriesModule);
//# sourceMappingURL=countries.module.js.map