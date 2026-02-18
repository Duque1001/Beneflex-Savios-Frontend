import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import type { Request } from 'express';
import { FunctionsProxyService } from './functions-proxy.service';

@Controller()
export class FunctionsProxyController {
  constructor(private readonly fx: FunctionsProxyService) {}

  private getToken(req: Request): string | undefined {
    const auth = req.headers.authorization ?? '';
    if (!auth.startsWith('Bearer ')) return undefined;
    return auth.slice(7);
  }

  @Get('get-me')
  getMe(@Req() req: Request) {
    return this.fx.callFunction('get-me', this.getToken(req));
  }

  @Get('get-user-benefits')
  getBenefits(@Req() req: Request) {
    return this.fx.callFunction('get-user-benefits', this.getToken(req));
  }

  @Post('create-benefit-request')
  create(@Req() req: Request, @Body() body: unknown) {
    return this.fx.callFunction(
      'create-benefit-request',
      this.getToken(req),
      body,
    );
  }

  @Get('get-my-requests')
  my(@Req() req: Request) {
    return this.fx.callFunction('get-my-requests', this.getToken(req));
  }

  @Get('get-pending-requests')
  pending(@Req() req: Request) {
    return this.fx.callFunction('get-pending-requests', this.getToken(req));
  }

  @Post('update-request-status')
  update(@Req() req: Request, @Body() body: unknown) {
    return this.fx.callFunction(
      'update-request-status',
      this.getToken(req),
      body,
    );
  }
}
