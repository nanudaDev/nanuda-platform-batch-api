import { Injectable } from '@nestjs/common';
import {
  BaseService,
  NanudaSlackNotificationService,
  FOUNDER_CONSULT,
} from 'src/core';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { DeliveryFounderConsult } from './delivery-founder-consult.entity';
import { Repository, EntityManager } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class FounderConsultService extends BaseService {
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
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
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
    if (ids && ids.length > 0) {
      await this.nanudaSlackNotificationService.sendIncompleteFounderConsultNotification(
        ids,
      );
    }
  }
}
