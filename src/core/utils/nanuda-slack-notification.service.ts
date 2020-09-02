require('dotenv').config();
import { Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import * as Slack from 'slack-node';
import { SLACK_NOTIFICATION_PROPERTY } from '..';
import { CompanyUser } from 'src/modules/company-user/company-user.entity';

@Injectable()
export class NanudaSlackNotificationService extends BaseService {
  slack = new Slack();
  webhookuri = process.env.PLATFORM_NOTIFICATION_SLACK_URL;

  private createMultipleLinks(founderConsultNos: string[]) {
    const slackFields = [];
    founderConsultNos.map(founderConsultNo => {
      slackFields.push({
        value: `${process.env.ADMIN_BASEURL}delivery-founder-consult/${founderConsultNo}`,
        short: false,
      });
    });
    return slackFields;
  }

  private createMultipleCompanyUserDormantLinks(companyUser: CompanyUser[]) {
    const slackFields = [];
    companyUser.map(companyUser => {
      slackFields.push({
        value: `${companyUser.name}\n ${process.env.ADMIN_BASEURL}company/company-user/${companyUser.no}`,
        short: false,
      });
    });
    return slackFields;
  }

  async sendIncompleteFounderConsultNotification(founderConsultNos: string[]) {
    const field = this.createMultipleLinks(founderConsultNos);
    const message = {
      text: `신청 미전달완료 알림`,
      username: SLACK_NOTIFICATION_PROPERTY.founderConsultUsername,
      attachments: [
        {
          fields: [
            {
              title: `${SLACK_NOTIFICATION_PROPERTY.founderConsultUsername}`,
              value: `오늘 전달완료하지 못한 방문자 신청 아이디들입니다. `,
              short: false,
            },
            ...field,
          ],
        },
      ],
    };
    this.__send_slack(message);
  }

  /**
   * 휴면 계정 (업체) 안내
   * @param companyUsers
   */
  async sendDormantCompanyUserNotification(companyUsers: CompanyUser[]) {
    const fields = this.createMultipleCompanyUserDormantLinks(companyUsers);
    const message = {
      text: `휴면계정 안내`,
      username: SLACK_NOTIFICATION_PROPERTY.companyUserDormanntNotification,
      attachments: [
        {
          fields: [
            {
              title: `${SLACK_NOTIFICATION_PROPERTY.companyUserDormanntNotification}`,
              value: `오늘부로 휴면계정으로 변경된 회원들입니다.`,
              short: false,
            },
            ...fields,
          ],
        },
      ],
    };
    this.__send_slack(message);
  }

  // send notification
  private __send_slack(message: object) {
    this.slack.setWebhook(this.webhookuri);
    this.slack.webhook(message, function(err, response) {
      if (err) {
        console.log(err);
      }
    });
  }
}
