import { Module } from '@nestjs/common';
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
export class AppModule {}
