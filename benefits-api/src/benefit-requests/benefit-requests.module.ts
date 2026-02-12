import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BenefitRequestsController } from './benefit-requests.controller';
import { BenefitRequestsService } from './benefit-requests.service';

import { BenefitRequest } from './entities/benefit-request.entity';
import { Benefit } from '../benefits/entities/benefit.entity';
import { BenefitBalancesModule } from '../benefit-balances/benefit-balances.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BenefitRequest, Benefit]),
    BenefitBalancesModule,
  ],
  controllers: [BenefitRequestsController],
  providers: [BenefitRequestsService],
  exports: [BenefitRequestsService],
})
export class BenefitRequestsModule {}
