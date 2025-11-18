export interface ExternalCountry {
  code: string;
  name: string;
  region: string;
  subregion: string;
  capital: string;
  population: number;
  flagUrl: string;
}

export interface CountryInformationProvider {
  findByAlpha3(code: string): Promise<ExternalCountry | null>;
}

export const COUNTRY_INFORMATION_PROVIDER = Symbol('COUNTRY_INFORMATION_PROVIDER');
