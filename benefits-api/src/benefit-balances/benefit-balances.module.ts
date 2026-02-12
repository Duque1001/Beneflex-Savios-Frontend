import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BenefitBalance } from './entities/benefit-balance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BenefitBalance])],
  exports: [TypeOrmModule],
})
export class BenefitBalancesModule {}
