import { Controller, Get, Req } from '@nestjs/common';
import { FunctionsProxyService } from './functions-proxy.service';

@Controller()
export class FunctionsProxyController {
  constructor(private readonly fx: FunctionsProxyService) {}

  @Get('get-me')
  async getMe(@Req() req: any) {
    const auth = req.headers?.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    return this.fx.getMe(token);
  }
}
