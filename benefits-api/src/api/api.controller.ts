import { Controller, Get } from '@nestjs/common';
import { FunctionsClient } from '../functions/functions.client';

@Controller('api')
export class ApiController {
  constructor(private readonly fx: FunctionsClient) {}

  @Get('get-me')
  getMe() {
    return this.fx.getMe();
  }

  @Get('get-user-benefits')
  getUserBenefits(@Query('userId') userId: string) {
    return this.fx.getUserBenefits(Number(userId));
  }
}
