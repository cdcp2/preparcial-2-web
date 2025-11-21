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
exports.CountriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const country_entity_1 = require("./entities/country.entity");
const country_information_provider_1 = require("../external/rest-countries/country-information.provider");
const travel_plan_entity_1 = require("../travel-plans/entities/travel-plan.entity");
let CountriesService = class CountriesService {
    countriesRepository;
    travelPlansRepository;
    countryInformationProvider;
    constructor(countriesRepository, travelPlansRepository, countryInformationProvider) {
        this.countriesRepository = countriesRepository;
        this.travelPlansRepository = travelPlansRepository;
        this.countryInformationProvider = countryInformationProvider;
    }
    findAll() {
        return this.countriesRepository.find({
            order: {
                name: 'ASC',
            },
        });
    }
    async findByAlpha3(alpha3Code) {
        const normalizedCode = this.normalizeCode(alpha3Code);
        const cachedCountry = await this.countriesRepository.findOne({
            where: { code: normalizedCode },
        });
        if (cachedCountry) {
            return { country: cachedCountry, source: 'cache' };
        }
        const externalCountry = await this.countryInformationProvider.findByAlpha3(normalizedCode);
        if (!externalCountry) {
            throw new common_1.NotFoundException(`Country with code ${normalizedCode} was not found`);
        }
        const newCountry = this.countriesRepository.create({
            code: normalizedCode,
            name: externalCountry.name,
            region: externalCountry.region,
            subregion: externalCountry.subregion,
            capital: externalCountry.capital,
            population: externalCountry.population,
            flagUrl: externalCountry.flagUrl,
        });
        const savedCountry = await this.countriesRepository.save(newCountry);
        return { country: savedCountry, source: 'external' };
    }
    async ensureCountryExists(alpha3Code) {
        const result = await this.findByAlpha3(alpha3Code);
        return result.country;
    }
    async deleteByAlpha3(alpha3Code) {
        const normalizedCode = this.normalizeCode(alpha3Code);
        const country = await this.countriesRepository.findOne({
            where: { code: normalizedCode },
        });
        if (!country) {
            throw new common_1.NotFoundException(`Country with code ${normalizedCode} was not found`);
        }
        const existingPlans = await this.travelPlansRepository.count({
            where: { countryCode: normalizedCode },
        });
        if (existingPlans > 0) {
            throw new common_1.BadRequestException(`Country ${normalizedCode} cannot be deleted because it has associated travel plans`);
        }
        await this.countriesRepository.remove(country);
    }
    normalizeCode(code) {
        return code.trim().toUpperCase();
    }
};
exports.CountriesService = CountriesService;
exports.CountriesService = CountriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(country_entity_1.Country)),
    __param(1, (0, typeorm_1.InjectRepository)(travel_plan_entity_1.TravelPlan)),
    __param(2, (0, common_1.Inject)(country_information_provider_1.COUNTRY_INFORMATION_PROVIDER)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository, Object])
], CountriesService);
//# sourceMappingURL=countries.service.js.map