import { Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import * as aligoapi from 'aligoapi';
import { YN } from 'src/common';
import { CompanyUser } from 'src/modules/company-user/company-user.entity';
import { AttendeesOnlineModule } from 'src/modules';
import { AttendeesOnline } from 'src/modules/attendees-online/attendees-online.entity';
import { Request } from 'express';
import { ENVIRONMENT } from 'src/config';
import { resolve } from 'path';
import * as fs from 'fs';
import { DeliveryFounderConsult } from 'src/modules/delivery-founder-consult/delivery-founder-consult.entity';
import { NanudaUser } from 'src/modules/nanuda-user/nanuda-user.entity';
require('dotenv').config();
class AligoAuth {
  key: string;
  user_id: string;
  testmode_yn: YN | string;
}

class MessageObject {
  body: Record<string, unknown>;
  auth: AligoAuth;
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

  async sendOneDayBeforeMessage(
    attendeesOnline: AttendeesOnline[],
    req: Request,
  ) {
    await Promise.all(
      attendeesOnline.map(async attendee => {
        const auth = await this.__get_auth();
        const body = await this.__send_one_day_before_message(attendee);
        req.body = body;
        const sms = await aligoapi.send(req, auth);
        if (process.env.NODE_ENV !== ENVIRONMENT.PRODUCTION) {
          console.log(sms);
        }
      }),
    );
  }

  async sendDayOfMessage(
    attendeesOnline: AttendeesOnline[],
    zoomLink: string,
    zoomId: string,
    zoomPassword: string,
    req: Request,
  ) {
    await Promise.all(
      attendeesOnline.map(async attendee => {
        const auth = await this.__get_auth();
        const body = await this.__send_day_of_message(
          attendee,
          zoomLink,
          zoomId,
          zoomPassword,
        );
        req.body = body;
        const sms = await aligoapi.send(req, auth);
        if (process.env.NODE_ENV !== ENVIRONMENT.PRODUCTION) {
          console.log(sms);
        }
      }),
    );
  }

  //   limit based on 500
  async sendCompanyUserDormantNotification(companyUsers: CompanyUser[]) {
    console.log('');
  }

  /**
   * send daily reminder to company user
   * @param companyUser
   * @param consults
   * @param req
   */
  async sendDailyFiveOClockReminder(
    companyUser: CompanyUser,
    consults: DeliveryFounderConsult[],
    req: Request,
  ) {
    const payload = await this.__send_unopened_consult_reminder(
      companyUser,
      consults,
    );
    req.body = payload.body;
    const sms = await aligoapi.send(req, payload.auth);
    if (process.env.NODE_ENV !== ENVIRONMENT.PRODUCTION) {
      console.log(sms);
    }
    return;
  }

  /**
   * 지연 메시지 전달
   * @param nanudaUser
   * @param consults
   * @param req
   */
  async sendDelayedReminderToUser(
    nanudaUser: Record<string, unknown>,
    consults: DeliveryFounderConsult[],
    req: Request,
  ) {
    const payload = await this.__send_delayed_consult_reminder_to_user(
      nanudaUser,
      consults,
    );
    req.body = payload.body;
    const sms = await aligoapi.send(req, payload.auth);
    if (process.env.NODE_ENV !== ENVIRONMENT.PRODUCTION) {
      console.log(sms);
    }
    return;
  }

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
      msg: `[나누다키친] 안녕하세요 ${attendees.name}님, 나누다키친입니다. \n나누다키친 온라인 창업 설명회에 신청해주셔서 감사드립니다. \n\n온라인 창업설명회 안내드립니다. \n\n날짜: ${todayDate}\n시간: ${attendees.eventTime}\n이용방법: 줌(ZOOM) 사이트 또는 앱으로 간편하게 화상으로 창업설명회에 참여 가능합니다.\n\n문의사항이 있으신 경우 해당 번호로 연락주시면 상담 도와드리겠습니다.\n\n나누다키친 영업시간 : 평일 10시~18시\n\n감사합니다 \n나누다키친 드림.\n\nTEL:${process.env.ALIGO_SECONDARY_PHONE}`,
      title: '안녕하세요 나누다키친입니다.',
    };

    return body;
  }

  // 창업 설명회 3일 전 문자 발송
  private async __send_one_day_before_message(attendees: AttendeesOnline) {
    const filePath = resolve('src/shared/assets/images/test.png');
    const todayDate = new Date(attendees.presentationDate)
      .toISOString()
      .slice(0, 10);
    console.log(filePath);
    const body = {
      receiver: attendees.phone,
      sender: process.env.ALIGO_SENDER_PHONE,
      msg: `[나누다키친] 안녕하세요 ${attendees.name}님, 나누다키친입니다. \n나누다키친 온라인 창업 설명회에 신청해주셔서 감사드립니다. \n\n온라인 창업설명회 안내드립니다. \n\n날짜: ${todayDate}\n시간: ${attendees.eventTime}\n이용방법: 줌(ZOOM) 사이트 또는 앱으로 간편하게 화상으로 창업설명회에 참여 가능합니다\n참고: https://nanudakitchen.com/start-your-business/zoom-guide\n\n문의사항이 있으신 경우 해당 번호로 연락주시면 상담 도와드리겠습니다.\n\n나누다키친 영업시간 : 평일 10시~18시\n\n감사합니다 \n나누다키친 드림.\n\nTEL:${process.env.ALIGO_SECONDARY_PHONE}`,
      title: '안녕하세요 나누다키친입니다.',
    };

    return body;
  }

  // 창업 설명회 당일 문자 발송 (6시 전 )
  private async __send_day_of_message(
    attendees: AttendeesOnline,
    zoomLink: string,
    zoomId: string,
    zoomPassword: string,
  ) {
    // const todayDate = new Date(attendees.presentationDate)
    //   .toISOString()
    //   .slice(0, 10);
    const body = {
      receiver: attendees.phone,
      sender: process.env.ALIGO_SENDER_PHONE,
      msg: `[나누다키친] 안녕하세요 ${attendees.name}님, 나누다키친입니다. \n나누다키친 온라인 창업 설명회에 신청해주셔서 감사드립니다. \n\n금일 5시에 온라인 창업설명회가 시작합니다.
      줌(ZOOM) 사이트 또는 앱으로 들어가 아래 아이디를 입력하신 후 참가버튼을 눌러 참여해주세요 \n\n줌링크: ${zoomLink}\n줌 회의 ID: ${zoomId}\n암호: ${zoomPassword}.\n\n화상 회의에 참여만 하는 입장이기에 ZOOM 홀페이지에 별도로 가입하거나 로그인하지 않으셔도 됩니다.\n\n문의사항이 있으신 경우 해당 번호로 연락주시면 상담 도와드리겠습니다.\n\n나누다키친 영업시간 : 평일 10시~18시\n\n감사합니다 \n나누다키친 드림. \n\nTEL:${process.env.ALIGO_SECONDARY_PHONE}`,
      title: '안녕하세요 나누다키친입니다.',
    };

    return body;
  }

  /**
   * send to customer user
   * @param companyUser
   * @param consults
   */
  private async __send_unopened_consult_reminder(
    companyUser: CompanyUser,
    consults: DeliveryFounderConsult[],
  ): Promise<MessageObject> {
    const auth = await this.__get_auth();
    const cartedConsults = [];
    if (cartedConsults.length > 0) {
      consults.map(consult => {
        cartedConsults.push(
          ` - ${consult.deliverySpace.companyDistrict.nameKr} - (${consult.nanudaUser.name} | ${consult.nanudaUser.phone})\n   연결링크: ${process.env.B2B_BASE_URL}founder-consult/${consult.no}`,
        );
      });
    }
    const body = {
      receiver: companyUser.phone,
      sender: process.env.ALIGO_SENDER_PHONE,
      msg: `[나누다키친] 안녕하세요 나누다키친입니다. \n ${
        consults[0].deliverySpace.companyDistrict.company.nameKr
      }에 신청한 사용자들이 아직 상담을 못 받았습니다 \n\n ${cartedConsults.join(
        ' ',
      )}`,
      title: '안녕하세요 나누다키친입니다.',
    };

    return { auth, body };
  }

  /**
   * send to user reminder at 6
   * @param nanudaUser
   * @param consults
   */
  private async __send_delayed_consult_reminder_to_user(
    nanudaUser: Record<string, unknown>,
    consults: DeliveryFounderConsult[],
  ): Promise<MessageObject> {
    const auth = await this.__get_auth();
    const cartedConsults = [];
    if (cartedConsults.length > 0) {
      consults.map(consult => {
        cartedConsults.push(
          ` -${consult.deliverySpace.companyDistrict.company.nameKr} ${consult.deliverySpace.companyDistrict.nameKr}`,
        );
      });
    }
    const body = {
      receiver: nanudaUser.phone,
      sender: process.env.ALIGO_SENDER_PHONE,
      msg: `[나누다키친] 안녕하세요 공유주방 플랫폼 나누다키친입니다. \n신청하신 공유주방 담당자들의 연락이 지연된 점에 대하여 안내 문자 보내드립니다. \n${cartedConsults.join(
        ' ',
      )}`,
      title: '안녕하세요 나누다키친입니다.',
    };

    return { auth, body };
  }
}
