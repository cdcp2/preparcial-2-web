"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TravelPlanResponseDto = void 0;
const country_response_dto_1 = require("../../countries/dto/country-response.dto");
class TravelPlanResponseDto {
    id;
    countryCode;
    title;
    startDate;
    endDate;
    notes;
    createdAt;
    country;
    static fromEntity(travelPlan) {
        return {
            id: travelPlan.id,
            countryCode: travelPlan.countryCode,
            title: travelPlan.title,
            startDate: travelPlan.startDate,
            endDate: travelPlan.endDate,
            notes: travelPlan.notes ?? null,
            createdAt: travelPlan.createdAt,
            country: travelPlan.country
                ? country_response_dto_1.CountryResponseDto.fromEntity(travelPlan.country)
                : undefined,
        };
    }
}
exports.TravelPlanResponseDto = TravelPlanResponseDto;
//# sourceMappingURL=travel-plan-response.dto.js.map