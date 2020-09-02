import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { YN } from 'src/common';
import { Exclude, Expose, classToPlain } from 'class-transformer';
import { APPROVAL_STATUS, ACCOUNT_STATUS } from 'src/core';

@Entity({ name: 'B2B_COMPANY_USER' })
export class CompanyUser {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'NO',
    unsigned: true,
  })
  no: number;

  @Column({
    type: 'varchar',
    length: 20,
    name: 'NAME',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 12,
    nullable: false,
    unique: true,
    name: 'PHONE',
  })
  phone: string;

  @Column({
    type: 'int',
    nullable: true,
    name: 'ADMIN_NO',
  })
  adminNo?: number;

  @Column({
    type: 'int',
    nullable: true,
    name: 'COMPANY_ADMIN_NO',
  })
  companyAdminNo?: number;

  @Column({
    type: 'varchar',
    name: 'EMAIL',
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'int',
    name: 'COMPANY_NO',
    nullable: false,
  })
  companyNo: number;

  @Column({
    type: 'char',
    default: YN.NO,
    nullable: false,
    name: 'PASSWORD_CHANGED_YN',
  })
  passwordChangedYn?: YN;

  @Column({
    type: 'varchar',
    name: 'COMPANY_USER_STATUS',
    default: APPROVAL_STATUS.NEED_APPROVAL,
  })
  companyUserStatus: APPROVAL_STATUS;

  @Column({
    type: 'datetime',
    name: 'LAST_LOGIN_AT',
    nullable: true,
  })
  lastLoginAt?: Date;

  @Column({
    type: 'varchar',
    nullable: false,
    default: ACCOUNT_STATUS.ACCOUNT_STATUS_ACTIVE,
    name: 'COMPANY_USER_ACCOUNT_STATUS',
  })
  companyUserAccountStatus: ACCOUNT_STATUS;
}
