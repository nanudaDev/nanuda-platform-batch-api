import { Controller, Get, Query, Req } from '@nestjs/common';
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
  @Get('/attendees-online/three-day-message')
  async sendMessage(@Query() days: number, @Req() req: Request) {
    return await this.attendeesOnlineService.sendMessageThreeDaysBefore(
      days,
      req,
    );
  }

  @Get('/attendees-online/send-message-day-before')
  async sendMessageDayBefore(@Req() req: Request) {
    return await this.attendeesOnlineService.sendMessageDayBefore(req);
  }

  /**
   * 당일 문자하기
   */
  @Get('/attendees-online/send-message-day-of')
  async sendDayOfMessage(@Req() req: Request) {
    return await this.attendeesOnlineService.sendTheDayOfEvent(req);
  }

  @Get('/attendees-online/send-video-link')
  async sendVideoLink(@Req() req: Request) {
    return await this.attendeesOnlineService.sendVideoLink(req);
  }
}
