import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryFounderConsult } from './delivery-founder-consult.entity';
import { FounderConsultService } from './delivery-founder-consult.service';
import { NanudaSlackNotificationService } from 'src/core/utils/nanuda-slack-notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryFounderConsult])],
  controllers: [],
  providers: [FounderConsultService, NanudaSlackNotificationService],
})
export class DeliveryFounderConsultModule {}
