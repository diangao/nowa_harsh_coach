declare namespace WechatMiniprogram {
  interface UserInfo {
    nickName: string;
    avatarUrl: string;
    gender: number;
    country: string;
    province: string;
    city: string;
    language: string;
  }

  interface GetUserInfoSuccessCallback {
    userInfo: UserInfo;
    rawData: string;
    signature: string;
    encryptedData: string;
    iv: string;
  }
} 