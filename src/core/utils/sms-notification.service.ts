import { Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import * as aligoapi from 'aligoapi';
import { YN } from 'src/common';
import { CompanyUser } from 'src/modules/company-user/company-user.entity';

export class AligoAuth {
  key: string;
  user_id: string;
  testmode_yn: YN | string;
}

@Injectable()
export class SmsAuthNotificationService extends BaseService {
  constructor() {
    super();
  }

  //   limit based on 500
  async sendCompanyUserDormantNotification(companyUsers: CompanyUser[]) {}

  /**
   * 휴면계정 메시지
   */

  /**
   * aligo api authentication
   */
  private async __get_auth(): Promise<AligoAuth> {
    const auth = new AligoAuth();
    auth.user_id = process.env.ALIGO_USER_ID;
    auth.key = process.env.ALIGO_API_KEY;
    auth.testmode_yn = process.env.ALIGO_TESTMODE;
    return auth;
  }
}
