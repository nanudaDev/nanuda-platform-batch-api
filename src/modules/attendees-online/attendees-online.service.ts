import { Injectable, Query } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { YN } from 'src/common';
import { BaseService } from 'src/core';
import { EntityManager, Repository } from 'typeorm';
import { AttendeesOnline } from './attendees-online.entity';

@Injectable()
export class AttendeesOnlineService extends BaseService {
  constructor(
    @InjectRepository(AttendeesOnline)
    private readonly attendeesOnlineRepo: Repository<AttendeesOnline>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    super();
  }

  /**
   * send message three days before
   */
  async sendMessageThreeDaysBefore(days: number) {
    //   get date if date is over january 29th stop cron job
    // days default to 3
    const currentDate = new Date();
    if (currentDate < new Date('2021-01-30')) {
      //   const todayDate = new Date().toISOString().slice(0, 10);
      //   console.log(todayDate);
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
        .AndWhereXDaysBefore(2.8)
        .getMany();
      console.log(qb);
      if (qb && qb.length > 0) {
        // send message
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
  async sendMessageDayBefore() {
    const currentDate = new Date();
    if (currentDate < new Date('2020-01-30')) {
      const qb = await this.attendeesOnlineRepo
        .createQueryBuilder('attendeesOnline')
        // .where('attendeesOnline.threeDayFlag = :threeDayFlag', {
        //   threeDayFlag: YN.YES,
        // })
        .where('attendeesOnline.dayBeforeMessageSent = :dayBeforeMessageSent', {
          dayBeforeMessageSent: YN.NO,
        })
        .AndWhereXDaysBefore(1)
        .getMany();
      console.log(qb);
      if (qb && qb.length > 0) {
        // send message
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

  async sendTheDayOfEvent() {
    const todayDate = new Date().toISOString().slice(0, 10);
    const qb = await this.attendeesOnlineRepo
    .createQueryBuilder('attendeesOnline')
    .AndWhereOnDayOf(todayDate)
    .getMany()
  // send text message
    await Promise.all(qb.map(async q => {}))
  }
}
