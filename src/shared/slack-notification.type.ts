export class SmsAuthNotificationType {
  count: number;
  message?: string;
  notificationType?: NotificationType;
}

export enum NotificationType {
  loginAuthCode = '인증번호',
}

export enum SLACK_NOTIFICATION_PROPERTY {
  founderConsultUsername = '방문자 신청',
  companyUserUpdateUsername = '업체 사용자 정보 수정',
  inquiryUsername = '나누다 플랫폼 시스템 문의',
  companyUserDormanntNotification = '업체 사용자 휴면계정 변환 안내',
  pictureReminderNotification = '공간 사진 등록 미완료 안내',
}
