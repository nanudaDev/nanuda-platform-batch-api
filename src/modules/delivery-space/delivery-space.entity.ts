import { BaseEntity, SPACE_PIC_STATUS } from 'src/core';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'B2B_DELIVERY_SPACE' })
export class DeliverySpace extends BaseEntity<DeliverySpace> {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'NO',
    unsigned: true,
  })
  no: number;

  @Column({
    type: 'varchar',
    nullable: false,
    default: SPACE_PIC_STATUS.EMPTY,
    name: 'PIC_STATUS',
  })
  picStatus: SPACE_PIC_STATUS;
}
