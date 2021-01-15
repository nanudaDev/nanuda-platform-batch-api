import { Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import * as aligoapi from 'aligoapi';
import { YN } from 'src/common';
import { CompanyUser } from 'src/modules/company-user/company-user.entity';
import { AttendeesOnlineModule } from 'src/modules';
import { AttendeesOnline } from 'src/modules/attendees-online/attendees-online.entity';
import { Request } from 'express';
import { ENVIRONMENT } from 'src/config';
require('dotenv').config();
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

  async sendThreeDaysBeforeMessage(
    attendeesOnline: AttendeesOnline[],
    req: Request,
  ) {
    await Promise.all(
      attendeesOnline.map(async attendee => {
        const auth = await this.__get_auth();
        const body = await this.__send_three_days_before_message(attendee);
        req.body = body;
        const sms = await aligoapi.send(req, auth);
        if (process.env.NODE_ENV !== ENVIRONMENT.PRODUCTION) {
          console.log(sms);
        }
      }),
    );
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

  // 창업 설명회 3일 전 문자 발송
  private async __send_three_days_before_message(attendees: AttendeesOnline) {
    const todayDate = new Date(attendees.presentationDate)
      .toISOString()
      .slice(0, 10);
    const body = {
      receiver: attendees.phone,
      sender: process.env.ALIGO_SENDER_PHONE,
      msg: `[나누디키친] 안녕하세요 ${attendees.name}님, 나누다키친입니다. \n나누다키친 온라인 창업 설명회에 신청해주셔서 감사드립니다. \n\n온라인 창업설명회 안내드립니다. \n\n날짜: ${todayDate}\n시간: ${attendees.eventTime}\n이용방법: 줌(ZOOM) 사이트 또는 앱으로 간편하게 화상으로 창업설명회에 참여 가능합니다.\n\n문의사항이 있으신 경우 해당 번호로 연락주시면 상담 도와드리겠습니다.\n\n나누다키친 영업시간 : 평일 10시~18시
      감사합니다 \n나누다키친 드림. \n\nTEL:02-556-5777 \n무료 거부 080-870-0727`,
      title: '안녕하세요 나누디키친입니다.',
    };

    return body;
  }
}
