import {
  Entity,
  Column,
  OneToMany,
  JoinColumn,
  OneToOne,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { YN } from 'src/common';
import { NANUDA_USER, GENDER } from 'src/shared';
import { DeliverySpace } from '../delivery-space/delivery-space.entity';
@Entity({ name: 'NANUDA_USER' })
export class NanudaUser {
  @PrimaryGeneratedColumn({
    name: 'NO',
    type: 'int',
    unsigned: true,
  })
  no: number;

  @Column({
    type: 'varchar',
    length: 12,
    nullable: false,
    unique: true,
    name: 'PHONE',
  })
  phone: string;

  @Column({
    type: 'varchar',
    length: 20,
    name: 'NAME',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'char',
    length: 1,
    nullable: true,
    default: YN.NO,
    name: 'INFO_YN',
  })
  infoYn?: string;

  @Column({
    type: 'char',
    length: 1,
    nullable: true,
    default: YN.YES,
    name: 'SERVICE_YN',
  })
  serviceYn?: string;

  @Column({
    type: 'char',
    length: 1,
    nullable: true,
    default: YN.NO,
    name: 'MARKET_YN',
  })
  marketYn?: string;

  // What is this column for???
  @Column({
    type: 'int',
    nullable: true,
    name: 'REMAIN_VISIT_COUNT',
    default: 1,
  })
  remainVisitCount?: number;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'LAST_LOGIN_AT',
  })
  lastLoginAt?: Date;

  @Column({
    type: 'char',
    nullable: true,
    name: 'GENDER',
  })
  gender?: GENDER;
}
