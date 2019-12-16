"use strict";

module.exports = {
  serverPort: 8889,
  isDev: false,
  jwt: {
    secretKey: "bAKVdqczerYAYKdMxsaBzbFUJU6ZvL2LwZuxhtpS"
  },
  //   /**
  //   Pay Per Tic Config DEV
  //  */
  //   paypertic: {
  //     username: '0Zpw3Uc9EWygImlG',
  //     password: 'it5Ou7u2Jkr6EHUlCu',
  //     grant_type: 'password',
  //     client_id: '16465308-1844-4abe-abe6-f184149ee740',
  //     client_secret: 'a2d03fa3-f6c4-45e5-9792-dc0d8b51a25c',
  //     token_noti_url: 'bAKVdqczerYAYKdMxsaBzbFUJU6ZvL2LwZuxhtpS'
  //   },
  /**
  Pay Per Tic Config PROD
 */
  paypertic: {
    username: "vhWdYFCfswfye6DX",
    password: "TY0gqYRN7QFgTxdLJN",
    grant_type: "password",
    client_id: "16465308-1844-4abe-abe6-f184149ee740",
    client_secret: "a2d03fa3-f6c4-45e5-9792-dc0d8b51a25c",
    token_noti_url: "bAKVdqczerYAYKdMxsaBzbFUJU6ZvL2LwZuxhtpS"
  },
  email: {
    SENDGRID_API_KEY:
      "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"
  }
  // require('dotenv').config();
  // const secret = process.env.SECRET || 'some other secret as default';
};
