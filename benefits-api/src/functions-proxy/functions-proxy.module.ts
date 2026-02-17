import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FunctionsProxyController } from './functions-proxy.controller';
import { FunctionsProxyService } from './functions-proxy.service';

@Module({
  imports: [HttpModule],
  controllers: [FunctionsProxyController],
  providers: [FunctionsProxyService],
})
export class FunctionsProxyModule {}
