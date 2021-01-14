import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendeesOnlineController } from './attendees-online.controller';
import { AttendeesOnline } from './attendees-online.entity';
import { AttendeesOnlineService } from './attendees-online.service';

@Module({
  imports: [TypeOrmModule.forFeature([AttendeesOnline])],
  controllers: [AttendeesOnlineController],
  providers: [AttendeesOnlineService],
})
export class AttendeesOnlineModule {}
