import { Controller, Get, Query, Req } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
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
  @Cron(CronExpression.EVERY_DAY_AT_9PM)
  @Get('/attendees-online/three-day-message')
  async sendMessage(@Req() req: Request) {
    return await this.attendeesOnlineService.sendMessageThreeDaysBefore(req);
  }

  @Cron(CronExpression.EVERY_DAY_AT_9PM)
  @Get('/attendees-online/send-message-day-before')
  async sendMessageDayBefore(@Req() req: Request) {
    return await this.attendeesOnlineService.sendMessageDayBefore(req);
  }

  /**
   * 당일 문자하기
   */
  @Cron(CronExpression.MONDAY_TO_FRIDAY_AT_4PM)
  @Get('/attendees-online/send-message-day-of')
  async sendDayOfMessage(@Req() req: Request) {
    return await this.attendeesOnlineService.sendTheDayOfEvent(req);
  }

  // TODO: cron expression at 6pm
  @Get('/attendees-online/send-video-link')
  async sendVideoLink(@Req() req: Request) {
    return await this.attendeesOnlineService.sendVideoLink(req);
  }
}
