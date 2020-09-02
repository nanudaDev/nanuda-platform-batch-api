import { Module, HttpModule } from '@nestjs/common';
import {
  SmsAuthModule,
  DeliveryFounderConsultModule,
  CompanyUserModule,
} from './modules';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService, HttpConfigService } from './config';
require('dotenv').config();
const env = process.env;
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    HttpModule.registerAsync({ useClass: HttpConfigService }),
    CompanyUserModule,
    DeliveryFounderConsultModule,
    SmsAuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
