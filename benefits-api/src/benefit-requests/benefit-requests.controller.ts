import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { BenefitRequestsService } from './benefit-requests.service';
import { CreateBenefitRequestDto } from './dto/create-benefit-request.dto';

@Controller('benefit-requests')
export class BenefitRequestsController {
  constructor(
    private readonly benefitRequestsService: BenefitRequestsService,
  ) {}

  @Post()
  create(@Body() dto: CreateBenefitRequestDto) {
    return this.benefitRequestsService.create(dto);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: number) {
    return this.benefitRequestsService.findByUser(+userId);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: number,
    @Body('status') status: 'APPROVED' | 'REJECTED',
  ) {
    return this.benefitRequestsService.updateStatus(id, status);
  }

  @Get('pending')
  findPending() {
    return this.benefitRequestsService.findPending();
  }
}
