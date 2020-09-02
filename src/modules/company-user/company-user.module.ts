import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyUser } from './company-user.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { CompanyUserService } from './company-user.service';
import { CompanyUserUpdateHistory } from '../company-user-update-history/company-user-update-history.entity';
import { NanudaSlackNotificationService } from 'src/core';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyUser, CompanyUserUpdateHistory]),
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [CompanyUserService, NanudaSlackNotificationService],
})
export class CompanyUserModule {}
