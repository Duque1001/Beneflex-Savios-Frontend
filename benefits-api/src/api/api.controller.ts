import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import type { Request } from 'express';

import { FunctionsClient } from '../functions/functions.client';

@Controller('api')
export class ApiController {
  constructor(private readonly fx: FunctionsClient) {}

  private auth(req: Request) {
    const h = req.headers['authorization'];
    return typeof h === 'string' ? h : undefined;
  }

  // Front espera /api/me
  @Get('me')
  me(@Req() req: Request) {
    return this.fx.getMe(this.auth(req));
  }

  // (opcional) compatibilidad: /api/get-me
  @Get('get-me')
  getMe(@Req() req: Request) {
    return this.fx.getMe(this.auth(req));
  }

  // Front espera /api/benefits?userId=...
  @Get('benefits')
  benefits(@Query('userId') userId: string, @Req() req: Request) {
    return this.fx.getUserBenefits(Number(userId), this.auth(req));
  }

  // Front espera POST /api/benefit-requests
  @Post('benefit-requests')
  createBenefitRequest(@Body() body: any, @Req() req: Request) {
    return this.fx.createBenefitRequest(body, this.auth(req));
  }

  // Front espera /api/my-requests
  @Get('my-requests')
  myRequests(@Req() req: Request) {
    return this.fx.getMyRequests(this.auth(req));
  }

  // Front espera /api/pending-requests
  @Get('pending-requests')
  pendingRequests(@Req() req: Request) {
    return this.fx.getPendingRequests(this.auth(req));
  }

  // Front espera POST /api/update-request-status
  @Post('update-request-status')
  updateRequestStatus(@Body() body: any, @Req() req: Request) {
    return this.fx.updateRequestStatus(body, this.auth(req));
  }
}
