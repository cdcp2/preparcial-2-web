"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const countries_module_1 = require("./countries/countries.module");
const travel_plans_module_1 = require("./travel-plans/travel-plans.module");
const country_entity_1 = require("./countries/entities/country.entity");
const travel_plan_entity_1 = require("./travel-plans/entities/travel-plan.entity");
const request_logger_middleware_1 = require("./common/middleware/request-logger.middleware");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(request_logger_middleware_1.RequestLoggerMiddleware)
            .forRoutes('countries', 'travel-plans');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'sqlite',
                    database: configService.get('DATABASE_PATH') ?? 'travel-planner.sqlite',
                    entities: [country_entity_1.Country, travel_plan_entity_1.TravelPlan],
                    synchronize: true,
                }),
            }),
            countries_module_1.CountriesModule,
            travel_plans_module_1.TravelPlansModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map