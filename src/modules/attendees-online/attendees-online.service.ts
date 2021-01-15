import { Injectable, Query } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { YN } from 'src/common';
import { ENVIRONMENT } from 'src/config';
import { BaseService, PRESENTATION_DISPLAY_TYPE } from 'src/core';
import { SmsAuthNotificationService } from 'src/core/utils/sms-notification.service';
import { EntityManager, Repository } from 'typeorm';
import { AttendeesOnline } from './attendees-online.entity';
import { PresentationEvent } from './presentation-event.entity';
require('dotenv').config();
@Injectable()
export class AttendeesOnlineService extends BaseService {
  constructor(
    @InjectRepository(AttendeesOnline)
    private readonly attendeesOnlineRepo: Repository<AttendeesOnline>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly smsNotificationService: SmsAuthNotificationService,
  ) {
    super();
  }

  /**
   * send message three days before
   */
  async sendMessageThreeDaysBefore(req: Request) {
    //   get date if date is over january 29th stop cron job
    // days default to 3
    const currentDate = new Date();
    if (currentDate < new Date('2021-01-30')) {
      const todayDate = new Date().toISOString().slice(0, 10);
      const qb = await this.attendeesOnlineRepo
        .createQueryBuilder('attendeesOnline')
        .where('attendeesOnline.threeDayFlag = :threeDayFlag', {
          threeDayFlag: YN.YES,
        })
        .andWhere(
          'attendeesOnline.threeDayMessageSent = :threeDayMessageSent',
          {
            threeDayMessageSent: YN.NO,
          },
        )
        // .AndWhereXDaysBefore(2.8)
        .andWhere(
          'attendeesOnline.threeDayBeforeMessageDate = :threeDayBeforeMessageDate',
          { threeDayBeforeMessageDate: todayDate },
        )
        .getMany();
      if (process.env.NODE_ENV !== ENVIRONMENT.PRODUCTION) {
        console.log(qb);
      }
      if (qb && qb.length > 0) {
        // send message
        await this.smsNotificationService.sendThreeDaysBeforeMessage(qb, req);
        // update column
        await Promise.all(
          qb.map(async q => {
            q.threeDayMessageSent = YN.YES;
            await this.attendeesOnlineRepo.save(q);
          }),
        );
      }
    }
  }

  /**
   * Day before message send
   */
  async sendMessageDayBefore(req: Request) {
    const currentDate = new Date();
    if (currentDate < new Date('2021-01-30')) {
      const todayDate = new Date().toISOString().slice(0, 10);
      console.log(todayDate);
      const qb = await this.attendeesOnlineRepo
        .createQueryBuilder('attendeesOnline')
        // .where('attendeesOnline.threeDayFlag = :threeDayFlag', {
        //   threeDayFlag: YN.YES,
        // })
        .where('attendeesOnline.dayBeforeMessageSent = :dayBeforeMessageSent', {
          dayBeforeMessageSent: YN.NO,
        })
        // .AndWhereXDaysBefore(0.8)
        .andWhere(
          'attendeesOnline.oneDayBeforeMessageDate = :oneDayBeforeMessageDate',
          { oneDayBeforeMessageDate: todayDate },
        )
        .getMany();
      if (process.env.NODE_ENV !== ENVIRONMENT.PRODUCTION) {
        console.log(qb);
      }
      if (qb && qb.length > 0) {
        // send message
        await this.smsNotificationService.sendOneDayBeforeMessage(qb, req);
        // update column
        await Promise.all(
          qb.map(async q => {
            q.dayBeforeMessageSent = YN.YES;
            await this.attendeesOnlineRepo.save(q);
          }),
        );
      }
    }
  }

  /**
   * send the day of the event
   */
  async sendTheDayOfEvent(req?: Request) {
    const currentDate = new Date();
    if (currentDate < new Date('2021-01-30')) {
      const todayDate = new Date().toISOString().slice(0, 10);
      const qb = await this.attendeesOnlineRepo
        .createQueryBuilder('attendeesOnline')
        .AndWhereOnDayOf(todayDate)
        .getMany();
      const getZoomLink = await this.entityManager
        .getRepository(PresentationEvent)
        .createQueryBuilder('event')
        .where('event.no = :no', { no: qb[0].eventNo })
        .andWhere('event.displayType = :displayType', {
          displayType: PRESENTATION_DISPLAY_TYPE.ONLINE,
        })
        .getOne();
      console.log(qb);
      // send text message
      if (qb && qb.length > 0) {
        await this.smsNotificationService.sendDayOfMessage(
          qb,
          getZoomLink.zoomLink,
          getZoomLink.zoomId,
          getZoomLink.zoomPassword,
          req,
        );
      }
    }
  }

  // cron for six o clock
  // @Cron(CronExpression.EVERY_DAY_AT_6PM)
  // TODO: THURSDAY OR FRIDAY NEXT WEEK
  async sendVideoLink(req: Request) {
    const currentDate = new Date();
    if (currentDate < new Date('2021-01-30')) {
      const todayDate = new Date().toISOString().slice(0, 10);
      // const todayDate = new Date('2021-01-18').toISOString().slice(0, 10);
      const qb = await this.attendeesOnlineRepo
        .createQueryBuilder('attendeesOnline')
        .AndWhereOnDayOf(todayDate)
        .getMany();
      console.log(qb);
      // send text message
      if (qb && qb.length > 0) {
      }
    }
  }
}
