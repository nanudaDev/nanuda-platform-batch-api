import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseEntity } from 'src/core';

@Entity({ name: 'SMS_AUTH' })
export class SmsAuth extends BaseEntity<SmsAuth> {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'NO',
    unsigned: true,
  })
  no: number;

  @Column({
    type: 'varchar',
    name: 'PHONE',
    nullable: false,
  })
  phone: string;

  @Column({
    type: 'varchar',
    name: 'AUTH_CODE',
    length: 6,
    nullable: false,
  })
  authCode: string;
}
