import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmsAuthNotificationService } from 'src/core/utils/sms-notification.service';
import { AttendeesOnlineController } from './attendees-online.controller';
import { AttendeesOnline } from './attendees-online.entity';
import { AttendeesOnlineService } from './attendees-online.service';
import { PresentationEvent } from './presentation-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AttendeesOnline, PresentationEvent])],
  controllers: [AttendeesOnlineController],
  providers: [AttendeesOnlineService, SmsAuthNotificationService],
})
export class AttendeesOnlineModule {}
