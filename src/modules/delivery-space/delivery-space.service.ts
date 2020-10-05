import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core';

@Injectable()
export class DeliverySpaceService extends BaseService {
  constructor() {
    super();
  }
}
