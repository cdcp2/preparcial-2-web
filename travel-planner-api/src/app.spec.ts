import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';

describe('AppModule', () => {
  it('compiles the application module', async () => {
    const testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    expect(testingModule).toBeDefined();
  });
});
