import { YN } from 'src/common';
import { BaseEntity, SPACE_PIC_STATUS } from 'src/core';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CompanyDistrict } from '../company-district/company-district.entity';
import { Company } from '../company/company.entity';

@Entity({ name: 'B2B_DELIVERY_SPACE' })
export class DeliverySpace extends BaseEntity<DeliverySpace> {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'NO',
    unsigned: true,
  })
  no: number;

  @Column({
    type: 'char',
    name: 'DEL_YN',
  })
  delYn: YN;

  @Column({
    type: 'char',
    name: 'SHOW_YN',
  })
  showYn: YN;

  @Column({
    type: 'varchar',
    nullable: false,
    default: SPACE_PIC_STATUS.EMPTY,
    name: 'PIC_STATUS',
  })
  picStatus: SPACE_PIC_STATUS;

  @ManyToOne(
    type => CompanyDistrict,
    companyDistrict => companyDistrict.deliverySpaces,
  )
  @JoinColumn({ name: 'COMPANY_DISTRICT_NO' })
  companyDistrict?: CompanyDistrict;
}
