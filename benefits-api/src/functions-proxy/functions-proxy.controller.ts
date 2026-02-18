import { Controller, Get, Req } from '@nestjs/common';
import { FunctionsProxyService } from './functions-proxy.service';

@Controller()
export class FunctionsProxyController {

  constructor(private readonly fx: FunctionsProxyService) {}

  private getToken(req: any): string {
    const auth = req.headers?.authorization || '';
    return auth.startsWith('Bearer ') ? auth.slice(7) : '';
  }

  @Get('get-me')
  getMe(@Req() req: any) {
    return this.fx.callFunction('get-me', this.getToken(req));
  }

  @Get('get-user-benefits')
  getBenefits(@Req() req: any) {
    return this.fx.callFunction('get-user-benefits', this.getToken(req));
  }

  @Post('create-benefit-request')
  create(@Req() req: any, @Body() body: any) {
    return this.fx.callFunction('create-benefit-request', this.getToken(req), body);
  }

  @Get('get-my-requests')
  my(@Req() req: any) {
    return this.fx.callFunction('get-my-requests', this.getToken(req));
  }

  @Get('get-pending-requests')
  pending(@Req() req: any) {
    return this.fx.callFunction('get-pending-requests', this.getToken(req));
  }

  @Post('update-request-status')
  update(@Req() req: any, @Body() body: any) {
    return this.fx.callFunction('update-request-status', this.getToken(req), body);
  }
}
