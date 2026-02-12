import { Test, TestingModule } from '@nestjs/testing';
import { BenefitRequestsService } from './benefit-requests.service';

describe('BenefitRequestsService', () => {
  let service: BenefitRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BenefitRequestsService],
    }).compile();

    service = module.get<BenefitRequestsService>(BenefitRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
