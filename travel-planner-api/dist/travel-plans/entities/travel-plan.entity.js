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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TravelPlan = void 0;
const typeorm_1 = require("typeorm");
const country_entity_1 = require("../../countries/entities/country.entity");
let TravelPlan = class TravelPlan {
    id;
    countryCode;
    title;
    startDate;
    endDate;
    notes;
    createdAt;
    country;
};
exports.TravelPlan = TravelPlan;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TravelPlan.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'country_code', length: 3 }),
    __metadata("design:type", String)
], TravelPlan.prototype, "countryCode", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TravelPlan.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'start_date', type: 'date' }),
    __metadata("design:type", String)
], TravelPlan.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'end_date', type: 'date' }),
    __metadata("design:type", String)
], TravelPlan.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], TravelPlan.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], TravelPlan.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => country_entity_1.Country, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'country_code', referencedColumnName: 'code' }),
    __metadata("design:type", country_entity_1.Country)
], TravelPlan.prototype, "country", void 0);
exports.TravelPlan = TravelPlan = __decorate([
    (0, typeorm_1.Entity)({ name: 'travel_plans' })
], TravelPlan);
//# sourceMappingURL=travel-plan.entity.js.map