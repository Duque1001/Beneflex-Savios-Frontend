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
import { BenefitsModule } from './benefits/benefits.module';
import { BenefitRequestsModule } from './benefit-requests/benefit-requests.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiController } from './api/api.controller';
import { FunctionsClient } from './functions/functions.client';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'mssql', // o postgres según uses
      host: process.env.DB_HOST,
      port: 1433,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      options: {
        encrypt: true,
      },
    }),

    BenefitsModule,
    BenefitRequestsModule,
  ],
  controllers: [AppController, ApiController],
  providers: [AppService, FunctionsClient],
})
export class AppModule {}
