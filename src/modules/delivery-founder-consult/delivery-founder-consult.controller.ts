import { Controller, Get, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { BaseController } from 'src/core';
import { DeliveryFounderConsultService } from './delivery-founder-consult.service';

@Controller()
@ApiTags('DELIVERY FOUNDER CONSULT')
export class DeliveryFounderConsultController extends BaseController {
  constructor(
    private readonly deliveryFounderConsultService: DeliveryFounderConsultService,
  ) {
    super();
  }

  /**
   * 미열람 확인
   */
  @Get('/delivery-founder-consult/notify-company-user-new-consults')
  async sendForTodayRemind(@Req() req: Request) {
    return await this.deliveryFounderConsultService.sendReminderToCompanyUser(
      req,
    );
  }

  @Get('/delivery-founder-consult/notify-user-delayed-consult')
  async sendDelayedInformation(@Req() req: Request) {
    return await this.deliveryFounderConsultService.sendDelayNotificationToUser(
      req,
    );
  }
}
