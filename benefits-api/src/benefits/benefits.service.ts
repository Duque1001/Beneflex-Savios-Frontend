import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Benefit } from './entities/benefit.entity';
import { BenefitCardDto } from './dto/benefitCard.dto';
import { BenefitBalance } from '../benefit-balances/entities/benefit-balance.entity';


@Injectable()
export class BenefitsService {
  constructor(
    @InjectRepository(BenefitBalance)
    private balanceRepo: Repository<BenefitBalance>,
  ) {}

  async getBenefitsForUser(userId: number, year: number) {
    const balances = await this.balanceRepo.find({
      where: { user_id: userId, year },
      relations: ['benefit'],
    });

    return balances.map((b) => ({
      id: b.benefit.id,
      title: b.benefit.name,
      days: b.available_days,
      allowsRange: b.benefit.allows_range,
    }));
  }
}
