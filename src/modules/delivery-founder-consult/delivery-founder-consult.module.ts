import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryFounderConsult } from './delivery-founder-consult.entity';
import { DeliveryFounderConsultService } from './delivery-founder-consult.service';
import { NanudaSlackNotificationService } from 'src/core/utils/nanuda-slack-notification.service';
import { DeliveryFounderConsultController } from './delivery-founder-consult.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryFounderConsult])],
  controllers: [DeliveryFounderConsultController],
  providers: [DeliveryFounderConsultService, NanudaSlackNotificationService],
})
export class DeliveryFounderConsultModule {}
