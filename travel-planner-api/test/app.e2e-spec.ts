import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { COUNTRY_INFORMATION_PROVIDER } from '../src/external/rest-countries/country-information.provider';
import type {
  CountryInformationProvider,
  ExternalCountry,
} from '../src/external/rest-countries/country-information.provider';

class FakeCountryInformationProvider implements CountryInformationProvider {
  public readonly findByAlpha3 = jest.fn(
    async (code: string): Promise<ExternalCountry | null> => {
      if (code === 'COL') {
        return {
          code: 'COL',
          name: 'Colombia',
          region: 'Americas',
          subregion: 'South America',
          capital: 'Bogotá',
          population: 53000000,
          flagUrl: 'https://flagcdn.com/co.svg',
        };
      }
      return null;
    },
  );
}

describe('Travel Planner API (e2e)', () => {
  let app: INestApplication<App>;
  let server: any;
  let fakeProvider: FakeCountryInformationProvider;

  beforeEach(async () => {
    process.env.DATABASE_PATH = ':memory:';
    process.env.COUNTRY_DELETE_TOKEN = 'test-token';
    fakeProvider = new FakeCountryInformationProvider();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(COUNTRY_INFORMATION_PROVIDER)
      .useValue(fakeProvider)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();
    server = app.getHttpAdapter().getInstance();
  });

  afterEach(async () => {
    await app.close();
  });

  it('returns an empty list of countries by default', async () => {
    const response = await request(server).get('/countries');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('fetches a country from the provider only once and caches it afterwards', async () => {
    const firstResponse = await request(server).get(
      '/countries/COL',
    );
    expect(firstResponse.status).toBe(200);
    expect(firstResponse.body).toMatchObject({
      code: 'COL',
      source: 'external',
    });
    expect(fakeProvider.findByAlpha3).toHaveBeenCalledTimes(1);

    const secondResponse = await request(server).get(
      '/countries/COL',
    );
    expect(secondResponse.status).toBe(200);
    expect(secondResponse.body).toMatchObject({
      code: 'COL',
      source: 'cache',
    });
    expect(fakeProvider.findByAlpha3).toHaveBeenCalledTimes(1);
  });

  it('creates and retrieves travel plans associated to a cached country', async () => {
    await request(server).get('/countries/COL');

    const createResponse = await request(server)
      .post('/travel-plans')
      .send({
        countryCode: 'COL',
        title: 'Vacaciones',
        startDate: '2025-02-01',
        endDate: '2025-02-10',
        notes: 'Visitar Medellín',
      });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body).toMatchObject({
      countryCode: 'COL',
      title: 'Vacaciones',
      country: { code: 'COL' },
    });

    const listResponse = await request(server).get(
      '/travel-plans',
    );
    expect(listResponse.status).toBe(200);
    expect(listResponse.body).toHaveLength(1);

    const travelPlanId = createResponse.body.id;
    const detailResponse = await request(server).get(
      `/travel-plans/${travelPlanId}`,
    );
    expect(detailResponse.status).toBe(200);
    expect(detailResponse.body).toMatchObject({
      id: travelPlanId,
      title: 'Vacaciones',
    });
  });

  it('validates travel plan payloads', async () => {
    const response = await request(server)
      .post('/travel-plans')
      .send({
        countryCode: 'C',
        startDate: 'invalid',
        endDate: '2024-01-01',
      });

    expect(response.status).toBe(400);
  });

  it('requires the deletion token to remove a country', async () => {
    await request(server).get('/countries/COL');

    const response = await request(server).delete(
      '/countries/COL',
    );
    expect(response.status).toBe(403);
  });

  it('prevents deleting countries with travel plans', async () => {
    await request(server).get('/countries/COL');
    await request(server).post('/travel-plans').send({
      countryCode: 'COL',
      title: 'Viaje',
      startDate: '2025-02-01',
      endDate: '2025-02-05',
    });

    const response = await request(server)
      .delete('/countries/COL')
      .set('x-country-delete-token', 'test-token');
    expect(response.status).toBe(400);
  });

  it('deletes a country without plans when authorized', async () => {
    await request(server).get('/countries/COL');

    const deleteResponse = await request(server)
      .delete('/countries/COL')
      .set('x-country-delete-token', 'test-token');
    expect(deleteResponse.status).toBe(204);

    const lookupResponse = await request(server).get(
      '/countries/COL',
    );
    expect(lookupResponse.status).toBe(200);
    expect(fakeProvider.findByAlpha3).toHaveBeenCalledTimes(2);
  });
});
