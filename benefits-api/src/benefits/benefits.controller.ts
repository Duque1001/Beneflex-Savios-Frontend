import { Controller, Get, Query } from '@nestjs/common';
import { BenefitsService } from './benefits.service';

@Controller('api')
export class BenefitsController {
  constructor(private readonly benefitsService: BenefitsService) {}

  @Get('benefits')
  getUserBenefits(@Query('userId') userId: string) {
    const year = new Date().getFullYear();
    return this.benefitsService.getBenefitsForUser(Number(userId), year);
  }
}