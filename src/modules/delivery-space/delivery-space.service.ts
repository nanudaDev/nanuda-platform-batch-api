import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { YN } from 'src/common';
import {
  BaseService,
  NanudaSlackNotificationService,
  SPACE_PIC_STATUS,
} from 'src/core';
import { Repository } from 'typeorm';
import { DeliverySpace } from './delivery-space.entity';

@Injectable()
export class DeliverySpaceService extends BaseService {
  constructor(
    @InjectRepository(DeliverySpace)
    private readonly deliverySpaceRepo: Repository<DeliverySpace>,
    private readonly nanudaSlackNotificationService: NanudaSlackNotificationService,
  ) {
    super();
  }

  /**
   * remind everyday of what pictures are incomplete
   */
  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  async pictureReminder() {
    const qb = await this.deliverySpaceRepo
      .createQueryBuilder('deliverySpace')
      .where('deliverySpace.delYn = :delYn', { delYn: YN.NO })
      .andWhere('deliverySpace.showYn = :showYn', { showYn: YN.YES })
      .andWhere('deliverySpace.picStatus = :picStatus', {
        picStatus: SPACE_PIC_STATUS.INCOMPLETE,
      })
      .select(['deliverySpace.no'])
      .getMany();

    const ids = [];
    qb.map(id => {
      ids.push(id.no);
    });
    await this.nanudaSlackNotificationService.sendIncompleteDeliverySpacePictureNotification(
      ids,
    );
  }
}
