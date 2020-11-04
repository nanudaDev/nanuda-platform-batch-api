import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NanudaSlackNotificationService } from 'src/core';
import { DeliverySpace } from './delivery-space.entity';
import { DeliverySpaceService } from './delivery-space.service';

@Module({
  imports: [TypeOrmModule.forFeature([DeliverySpace])],
  controllers: [],
  providers: [DeliverySpaceService, NanudaSlackNotificationService],
})
export class DeliverySpaceModule {}
