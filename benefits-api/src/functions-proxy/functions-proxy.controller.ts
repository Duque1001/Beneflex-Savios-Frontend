import { Controller, Get, Post, Query, Body, Headers } from '@nestjs/common';
import { FunctionsProxyService } from './functions-proxy.service';

@Controller()
export class FunctionsProxyController {
  constructor(private readonly svc: FunctionsProxyService) {}

  @Get('get-me')
  getMe(@Headers('authorization') auth?: string) {
    return this.svc.getMe(auth);
  }

  @Get('get-user-benefits')
  getUserBenefits(
    @Query('userId') userId: string,
    @Headers('authorization') auth?: string,
  ) {
    return this.svc.getUserBenefits(userId, auth);
  }

  @Post('create-benefit-request')
  createBenefit(@Body() body: any, @Headers('authorization') auth?: string) {
    return this.svc.createBenefitRequest(body, auth);
  }

  @Get('get-my-requests')
  getMyRequests(
    @Query('userId') userId: string | undefined,
    @Headers('authorization') auth?: string,
  ) {
    return this.svc.getMyRequests(userId, auth);
  }

  @Get('get-pending-requests')
  getPending(@Headers('authorization') auth?: string) {
    return this.svc.getPendingRequests(auth);
  }

  @Post('update-request-status')
  updateStatus(@Body() body: any, @Headers('authorization') auth?: string) {
    return this.svc.updateRequestStatus(body, auth);
  }
}
