import { Injectable } from '@nestjs/common';
import {
  BaseService,
  NanudaSlackNotificationService,
  FOUNDER_CONSULT,
  B2B_FOUNDER_CONSULT,
  COMPANY_USER,
  RemoveDuplicateObject,
  SmsAuthNotificationService,
  APPROVAL_STATUS,
} from 'src/core';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { DeliveryFounderConsult } from './delivery-founder-consult.entity';
import { Repository, EntityManager } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { YN } from 'src/common';
import { CompanyUser } from '../company-user/company-user.entity';
import { Request } from 'express';
import Axios from 'axios';
@Injectable()
export class DeliveryFounderConsultService extends BaseService {
  constructor(
    @InjectRepository(DeliveryFounderConsult)
    private readonly deliveryFounderConsultRepo: Repository<
      DeliveryFounderConsult
    >,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly nanudaSlackNotificationService: NanudaSlackNotificationService,
    private readonly smsNotificationService: SmsAuthNotificationService,
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
   * FIVE O CLOCK
   * @param req
   */
  async sendReminderToCompanyUser(req: Request) {
    let companyIds = [];
    const deliveryFounderConsultIds = [];
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

    // send message to individual companies
    if (qb && qb.length > 0) {
      qb.map(q => {
        companyIds.push({
          companyNo: q.deliverySpace.companyDistrict.companyNo,
        });
        deliveryFounderConsultIds.push(q.no);
      });
      companyIds = RemoveDuplicateObject(companyIds, 'companyNo');
      if (companyIds.length > 0) {
        await Promise.all(
          companyIds.map(async companyId => {
            const companyConsults = await this.deliveryFounderConsultRepo
              .createQueryBuilder('deliveryFounderConsult')
              .CustomInnerJoinAndSelect(['deliverySpace'])
              .innerJoinAndSelect(
                'deliverySpace.companyDistrict',
                'companyDistrict',
              )
              .innerJoinAndSelect('companyDistrict.company', 'company')
              .where('company.no = :no', { no: companyId.companyNo })
              .AndWhereIn(
                'deliveryFounderConsult',
                'no',
                deliveryFounderConsultIds,
              )
              .getMany();

            // get master user for company
            const masterUser = await this.entityManager
              .getRepository(CompanyUser)
              .createQueryBuilder('companyUser')
              .where('companyUser.companyNo = :companyNo', {
                companyNo: companyId.companyNo,
              })
              .andWhere('companyUser.authCode = :authCode', {
                authCode: COMPANY_USER.ADMIN_COMPANY_USER,
              })
              .getMany();
            // await this sms notification for user
            await this.smsNotificationService.sendDailyFiveOClockReminder(
              masterUser[0],
              companyConsults,
              req,
            );
          }),
        );
      }
    }
  }

  /**
   * send delayed notification
   * @param req
   */
  async sendDelayNotificationToUser(req: Request) {
    const nanudaUserNo = [];
    const deliveryFounderConsultIds = [];
    const qb = await this.deliveryFounderConsultRepo
      .createQueryBuilder('deliveryFounderConsult')
      .CustomInnerJoinAndSelect(['deliverySpace', 'nanudaUser'])
      .innerJoin('deliverySpace.companyDistrict', 'companyDistrict')
      .innerJoinAndSelect('companyDistrict.company', 'company')
      .where('company.companyStatus = :companyStatus', {
        companyStatus: APPROVAL_STATUS.APPROVAL,
      })
      .andWhere(
        'companyDistrict.companyDistrictStatus = :companyDistrictStatus',
        { companyDistrictStatus: APPROVAL_STATUS.APPROVAL },
      )
      .andWhere('deliverySpace.remainingCount > 0')
      .andWhere('deliveryFounderConsult.status = :status', {
        status: FOUNDER_CONSULT.F_NEW_REG,
      })
      .orWhere('deliveryFounderConsult.openedAt IS NULL')
      .getMany();

    if (qb && qb.length > 0) {
      qb.map(q => {
        nanudaUserNo.push({
          phone: q.nanudaUser.phone,
          name: q.nanudaUser.name,
          no: q.nanudaUser.no,
        });
        deliveryFounderConsultIds.push(q.no);
      });
      await Promise.all(
        nanudaUserNo.map(async nanudaUser => {
          const consults = await this.deliveryFounderConsultRepo
            .createQueryBuilder('deliveryFounderConsult')
            .CustomInnerJoinAndSelect(['deliverySpace', 'nanudaUser'])
            .innerJoin('deliverySpace.companyDistrict', 'companyDistrict')
            .innerJoinAndSelect('companyDistrict.company', 'company')
            .where('company.companyStatus = :companyStatus', {
              companyStatus: APPROVAL_STATUS.APPROVAL,
            })
            .andWhere(
              'companyDistrict.companyDistrictStatus = :companyDistrictStatus',
              { companyDistrictStatus: APPROVAL_STATUS.APPROVAL },
            )
            .andWhere('deliverySpace.remainingCount > 0')
            .andWhere('deliveryFounderConsult.status = :status', {
              status: FOUNDER_CONSULT.F_NEW_REG,
            })
            .orWhere('deliveryFounderConsult.openedAt IS NULL')
            .andWhere('nanudaUser.no = :nanudaUserNo', {
              nanudaUserNo: nanudaUser.no,
            })
            .AndWhereIn(
              'deliveryFounderConsult',
              'no',
              deliveryFounderConsultIds,
            )
            .getMany();
          await this.smsNotificationService.sendDelayedReminderToUser(
            nanudaUser,
            consults,
            req,
          );
        }),
      );
    }
  }

  @Cron(CronExpression.MONDAY_TO_FRIDAY_AT_5PM)
  async sendReminderAtFive() {
    await Axios.get(
      `${process.env.BATCH_API_URL}delivery-founder-consult/notify-company-user-new-consults`,
    );
  }

  @Cron(CronExpression.MONDAY_TO_FRIDAY_AT_6PM)
  async sendDelayedNotification() {
    await Axios.get(
      `${process.env.BATCH_API_URL}delivery-founder-consult/notify-user-delayed-consults`,
    );
  }
}
