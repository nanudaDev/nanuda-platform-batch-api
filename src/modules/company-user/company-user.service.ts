require('dotenv').config();
import { Injectable } from '@nestjs/common';
import {
  BaseService,
  ACCOUNT_STATUS,
  NanudaSlackNotificationService,
} from 'src/core';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { CompanyUser } from './company-user.entity';
import { Repository, EntityManager, In } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CompanyUserUpdateHistory } from '../company-user-update-history/company-user-update-history.entity';
import { ENVIRONMENT } from 'src/config';

@Injectable()
export class CompanyUserService extends BaseService {
  constructor(
    @InjectRepository(CompanyUser)
    private readonly companyUserRepo: Repository<CompanyUser>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly nanudaSlackNotificationService: NanudaSlackNotificationService,
  ) {
    super();
  }

  /**
   * 휴면계정으로 변환
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async dormantUser() {
    await this.entityManager.transaction(async entityManager => {
      const users = await this.companyUserRepo
        .createQueryBuilder('companyUser')
        .where('companyUser.companyUserAccountStatus = :accountStatus', {
          accountStatus: ACCOUNT_STATUS.ACCOUNT_STATUS_ACTIVE,
        })
        .AndWhereByYears(1)
        .getMany();
      console.log(users.length);
      if (users && users.length > 0) {
        const ids = [];
        await Promise.all(
          users.map(async user => {
            user.companyUserAccountStatus =
              ACCOUNT_STATUS.ACCOUNT_STATUS_DORMANT;
            // create new update history records
            let newUpdateHistory = this.__company_user_update_history(
              user.no,
              user,
            );
            newUpdateHistory = await entityManager.save(newUpdateHistory);
            ids.push(user.no);
          }),
        );
        if (ids && ids.length > 0) {
          // update using update query builder
          await this.companyUserRepo
            .createQueryBuilder()
            .update(CompanyUser)
            .set({
              companyUserAccountStatus: ACCOUNT_STATUS.ACCOUNT_STATUS_DORMANT,
            })
            .where({
              no: In(ids),
            })
            .execute();
          if (process.env.NODE_ENV !== ENVIRONMENT.PRODUCTION) {
            console.log(ids);
          }
          await this.nanudaSlackNotificationService.sendDormantCompanyUserNotification(
            users,
          );
        }
      }
    });
  }

  private __company_user_update_history(
    companyUserNo: number,
    companyUser: any,
  ) {
    const companyUserUpdateHistory = new CompanyUserUpdateHistory(companyUser);
    companyUserUpdateHistory.companyUserNo = companyUserNo;
    return companyUserUpdateHistory;
  }
}
