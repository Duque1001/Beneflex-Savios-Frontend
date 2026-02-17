import { Controller, Get, Param } from '@nestjs/common';
import { BenefitsService } from './benefits.service';
// import { BenefitCardDto } from './dto/benefitCard.dto';

@Controller('benefits')
export class BenefitsController {
  constructor(private readonly benefitsService: BenefitsService) {}

  @Get('user/:userId')
  getUserBenefits(@Param('userId') userId: number) {
    const year = new Date().getFullYear();
    return this.benefitsService.getBenefitsForUser(userId, year);
  }
}
