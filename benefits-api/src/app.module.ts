/*import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BenefitsModule } from './benefits/benefits.module';
import { BenefitRequestsModule } from './benefit-requests/benefit-requests.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiController } from './api/api.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BenefitsModule,
    BenefitRequestsModule,
  ],
  controllers: [AppController, ApiController],
  providers: [AppService],
})
export class AppModule {}*/

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiController } from './api/api.controller';
import { FunctionsClient } from './functions/functions.client';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController, ApiController],
  providers: [AppService, FunctionsClient],
})
export class AppModule {}
