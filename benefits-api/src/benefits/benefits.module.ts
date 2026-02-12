import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Benefit } from './entities/benefit.entity';
import { BenefitsService } from './benefits.service';
import { BenefitsController } from './benefits.controller';
import { BenefitBalancesModule } from '../benefit-balances/benefit-balances.module';

@Module({
  imports: [TypeOrmModule.forFeature([Benefit]), BenefitBalancesModule],
  controllers: [BenefitsController],
  providers: [BenefitsService],
  exports: [BenefitsService],
})
export class BenefitsModule {}
