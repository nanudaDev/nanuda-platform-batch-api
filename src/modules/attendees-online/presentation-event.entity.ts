import { YN } from 'src/common';
import {
  BaseEntity,
  PRESENTATION_DISPLAY_TYPE,
  PRESENTATION_EVENT_TYPE,
} from 'src/core';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'PRESENTATION_EVENT' })
export class PresentationEvent extends BaseEntity<PresentationEvent> {
  @PrimaryGeneratedColumn({
    name: 'NO',
    type: 'int',
    unsigned: true,
  })
  no: number;

  @Column({
    type: 'varchar',
    name: 'TITLE',
    nullable: false,
  })
  title: string;

  @Column({
    type: 'text',
    name: 'DESC',
  })
  desc?: string;

  @Column({
    type: 'varchar',
    name: 'ADDRESS',
  })
  address?: string;

  @Column({
    type: 'json',
    name: 'SCHEDULE',
    nullable: false,
  })
  schedule?: string[];

  @Column({
    type: 'varchar',
    name: 'EVENT_TYPE',
    default: PRESENTATION_EVENT_TYPE.COMMON_EVENT,
  })
  eventType: PRESENTATION_EVENT_TYPE;

  @Column({
    type: 'datetime',
    name: 'PRESENTATION_DATE',
    nullable: false,
  })
  presentationDate: Date;

  @Column({
    type: 'varchar',
    name: 'CONTACT_PHONE',
    default: '02-556-5777',
  })
  contactPhone?: string;

  @Column('varchar', {
    length: 255,
    nullable: true,
    name: 'LAT',
  })
  lat?: string;

  @Column('varchar', {
    length: 255,
    nullable: true,
    name: 'LON',
  })
  lon?: string;

  @Column({
    type: 'text',
    name: 'POST_EVENT_DESC',
  })
  postEventDesc?: string;

  @Column({
    type: 'varchar',
    name: 'BUTTON_DESC',
    default: '창업 설명회 신청하기',
  })
  buttonDesc?: string;

  @Column({
    type: 'varchar',
    name: 'ZOOM_LINK',
  })
  zoomLink?: string;

  @Column({
    type: 'varchar',
    name: 'ZOOM_ID',
  })
  zoomId?: string;

  @Column({
    type: 'varchar',
    name: 'ZOOM_PASSWORD',
  })
  zoomPassword?: string;

  @Column({
    type: 'varchar',
    name: 'DISPLAY_TYPE',
    default: PRESENTATION_DISPLAY_TYPE.OFFLINE,
  })
  displayType?: PRESENTATION_DISPLAY_TYPE;

  // presentation event finished
  isEnded?: YN;

  // 주변 전철 정보
  subwayStations?: any;
}
