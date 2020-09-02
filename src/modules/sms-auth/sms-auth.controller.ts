import { Controller, Get } from '@nestjs/common';
import { BaseController } from 'src/core';
import { SmsAuthService } from './sms-auth.service';

@Controller()
export class SmsAuthController extends BaseController {
  constructor(private readonly smsAuthService: SmsAuthService) {
    super();
  }

  @Get('/sms-auth')
  async testing(): Promise<any> {
    return await this.smsAuthService.deleteExpiredAuthCode();
  }
}
