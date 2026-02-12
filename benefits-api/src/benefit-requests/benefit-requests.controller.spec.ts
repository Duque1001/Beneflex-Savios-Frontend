import { Test, TestingModule } from '@nestjs/testing';
import { BenefitRequestsController } from './benefit-requests.controller';
import { BenefitRequestsService } from './benefit-requests.service';

describe('BenefitRequestsController', () => {
  let controller: BenefitRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BenefitRequestsController],
      providers: [BenefitRequestsService],
    }).compile();

    controller = module.get<BenefitRequestsController>(BenefitRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
