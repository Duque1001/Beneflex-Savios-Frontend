import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { FunctionsProxyModule } from './functions-proxy/functions-proxy.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
    FunctionsProxyModule,
  ],
})
export class AppModule {}
