import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core';
import { AttendeesOnlineService } from './attendees-online.service';

@Controller()
@ApiTags('ATTENDEES ONLINE')
export class AttendeesOnlineController extends BaseController {
  constructor(private readonly attendeesOnlineService: AttendeesOnlineService) {
    super();
  }

  /**
   * send message
   * @param days
   */
  @Get('/attendees-online/three-day-message')
  async sendMessage(@Query() days: number) {
    return await this.attendeesOnlineService.sendMessageThreeDaysBefore(days);
  }
}
