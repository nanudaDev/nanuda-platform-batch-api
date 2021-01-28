import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
  async sendForTodayRemind() {
    return await this.deliveryFounderConsultService.send2HourReminderForTheDayToCompanyUser();
  }
}
