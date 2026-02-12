import { Controller, Get, Post, Body } from '@nestjs/common';
import { FunctionsClient } from '../functions/functions.client';

@Controller('api')
export class ApiController {
  private fx = new FunctionsClient();

  @Get('me')
  getMe() {
    return this.fx.getMe();
  }

  @Post('benefit-requests')
  createRequest(@Body() body: any) {
    return this.fx.createBenefitRequest(body);
  }

  @Get('my-requests')
  myRequests() {
    return this.fx.getMyRequests();
  }

  @Get('pending-requests')
  pending() {
    return this.fx.getPendingRequests();
  }

  @Post('update-request-status')
  updateStatus(@Body() body: any) {
    return this.fx.updateRequestStatus(body);
  }
}