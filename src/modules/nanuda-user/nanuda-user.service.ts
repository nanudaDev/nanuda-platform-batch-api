import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core';

@Injectable()
export class NanudaUserService extends BaseService {
  constructor() {
    super();
  }
}
