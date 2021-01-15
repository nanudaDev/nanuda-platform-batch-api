import { YN } from 'src/common';
import { BaseEntity, BaseMapperEntity } from 'src/core';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ATTENDEES_ONLINE' })
export class AttendeesOnline extends BaseMapperEntity<AttendeesOnline> {
  @PrimaryGeneratedColumn({
    name: 'NO',
    type: 'int',
    unsigned: true,
  })
  no: number;

  @Column({
    name: 'NAME',
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    name: 'PHONE',
    type: 'varchar',
    nullable: false,
  })
  phone: string;

  @Column({
    name: 'EVENT_NO',
    type: 'int',
  })
  eventNo: number;

  @Column({
    name: 'EVENT_TIME',
    type: 'int',
    default: '17:00',
  })
  eventTime?: string;

  @Column({
    name: 'THREE_DAY_FLAG',
    type: 'char',
  })
  threeDayFlag?: YN;

  @Column({
    name: 'PRESENTATION_DATE',
    type: 'datetime',
  })
  presentationDate: Date;

  @Column({
    name: 'THREE_DAY_MESSAGE_SENT',
    type: 'char',
  })
  threeDayMessageSent?: YN;

  @Column({
    name: 'DAY_BEFORE_MESSAGE_SENT',
    type: 'char',
  })
  dayBeforeMessageSent?: YN;

  isNanudaUser?: YN;
}
