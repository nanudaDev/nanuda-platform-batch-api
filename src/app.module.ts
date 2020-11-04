import { Module, HttpModule } from '@nestjs/common';
import {
  SmsAuthModule,
  DeliveryFounderConsultModule,
  CompanyUserModule,
  DeliverySpaceModule,
} from './modules';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService, HttpConfigService } from './config';
require('dotenv').config();
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    HttpModule.registerAsync({ useClass: HttpConfigService }),
    CompanyUserModule,
    DeliveryFounderConsultModule,
    DeliverySpaceModule,
    SmsAuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
