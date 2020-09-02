require('dotenv').config();
import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { SmsAuth } from './sms-auth.entity';
import { Repository, EntityManager } from 'typeorm';
import { ENVIRONMENT } from 'src/config';

@Injectable()
export class SmsAuthService extends BaseService {
  constructor(
    @InjectRepository(SmsAuth)
    private readonly smsAuthRepo: Repository<SmsAuth>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    super();
  }

  // 인증키 3분 삭제
  @Cron(CronExpression.EVERY_5_SECONDS)
  async deleteExpiredAuthCode(): Promise<any> {
    const deleted = await this.smsAuthRepo
      .createQueryBuilder()
      .AndWhereSmsAuthDeleteTime()
      .delete()
      .execute();
    if (process.env.NODE_ENV !== ENVIRONMENT.PRODUCTION) {
      console.log(`Deleted ${deleted.affected} rows of data`);
    }
    return;
  }
}
