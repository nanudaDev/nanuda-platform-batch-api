import { Module, HttpModule } from '@nestjs/common';
import {
  SmsAuthModule,
  DeliveryFounderConsultModule,
  CompanyUserModule,
  DeliverySpaceModule,
  AttendeesOnlineModule,
} from './modules';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService, HttpConfigService } from './config';
import { ScheduleModule } from '@nestjs/schedule';
require('dotenv').config();
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    HttpModule.registerAsync({ useClass: HttpConfigService }),
    AttendeesOnlineModule,
    CompanyUserModule,
    DeliveryFounderConsultModule,
    DeliverySpaceModule,
    SmsAuthModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
