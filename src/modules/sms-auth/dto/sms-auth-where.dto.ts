import { BaseDto } from '../../../core';
import { ApiProperty } from '@nestjs/swagger';
import { SmsAuth } from '../sms-auth.entity';
export class SmsAuthWhereDto extends BaseDto<SmsAuthWhereDto> {
  constructor(partial?: any) {
    super(partial);
  }
}
