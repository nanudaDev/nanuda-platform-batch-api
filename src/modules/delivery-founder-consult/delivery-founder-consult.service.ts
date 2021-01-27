import { Injectable } from '@nestjs/common';
import {
  BaseService,
  NanudaSlackNotificationService,
  FOUNDER_CONSULT,
  B2B_FOUNDER_CONSULT,
} from 'src/core';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { DeliveryFounderConsult } from './delivery-founder-consult.entity';
import { Repository, EntityManager } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { YN } from 'src/common';

@Injectable()
export class DeliveryFounderConsultService extends BaseService {
  constructor(
    @InjectRepository(DeliveryFounderConsult)
    private readonly deliveryFounderConsultRepo: Repository<
      DeliveryFounderConsult
    >,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly nanudaSlackNotificationService: NanudaSlackNotificationService,
  ) {
    super();
  }

  /**
   * send warning notification
   */
  @Cron(CronExpression.EVERY_DAY_AT_6PM)
  async sendWarningNotification() {
    const deliveryFounderConsults = await this.deliveryFounderConsultRepo
      .createQueryBuilder('deliveryConsult')
      .select(['deliveryConsult.no'])
      .where('deliveryConsult.status = :status', {
        status: FOUNDER_CONSULT.F_NEW_REG,
      })
      .getMany();
    const ids = [];
    deliveryFounderConsults.map(id => {
      ids.push(id.no);
    });
    console.log(ids);
    if (ids && ids.length > 0) {
      await this.nanudaSlackNotificationService.sendIncompleteFounderConsultNotification(
        ids,
      );
    }
  }

  /**
   * send two hour reminder for company users every thirty minutes
   * limit to one day
   * TODO: limit to this day
   */
  async send2HourReminderForTheDayToCompanyUser() {
    const todayDate = new Date().toISOString().slice(0, 10);
    console.log(todayDate);
    // const deliveryFounderConsults = await this.deliveryFounderConsultRepo
    //   .createQueryBuilder('deliveryFounderConsult')
    //   .where(
    //     `deliveryFounderConsult.createdAt >= DATE_ADD(HOUR, -2, GETDATE())`,
    //   )
    //   // .andWhere('deliveryFounderConsult.createdAt < GETDATE()')
    //   .andWhere('deliveryFounderConsult.openedAt IS NULL')
    //   .getRawMany();

    // console.log(deliveryFounderConsults);
  }

  /**
   * send reminder message to company user
   * @param req
   */
  async sendReminderToCompanyUser(req: Request) {
    const companyIds = [];
    const qb = await this.deliveryFounderConsultRepo
      .createQueryBuilder('deliveryFounderConsult')
      .CustomInnerJoinAndSelect(['deliverySpace', 'nanudaUser'])
      .innerJoinAndSelect('deliverySpace.companyDistrict', 'companyDistrict')
      .innerJoinAndSelect('companyDistrict.company', 'company')
      .where('deliveryFounderConsult.openedAt IS NULL')
      .orWhere('deliveryFounderConsult.status = :status', {
        status: FOUNDER_CONSULT.F_NEW_REG,
      })
      .getMany();

    if (qb && qb.length > 0) {
      qb.map(q => {
        companyIds.push({
          companyNo: q.deliverySpace.companyDistrict.companyNo,
        });
      });
    }
  }
}
