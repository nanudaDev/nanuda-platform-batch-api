import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmsAuth } from './sms-auth.entity';
import { SmsAuthController } from './sms-auth.controller';
import { SmsAuthService } from './sms-auth.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [TypeOrmModule.forFeature([SmsAuth]), ScheduleModule.forRoot()],
  controllers: [SmsAuthController],
  providers: [SmsAuthService],
})
export class SmsAuthModule {}
