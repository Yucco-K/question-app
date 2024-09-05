import nodemailer from 'nodemailer';

async function sendTestEmail() {
  // SMTP設定
  const transporter = nodemailer.createTransport({
    host: 'email-smtp.ap-northeast-3.amazonaws.com', // AWS SES SMTPサーバー
    port: 587,
    secure: false, // ポート465を使用する場合、trueに設定
    auth: {
      user: 'AKIA6GBMCFAGBOZO24TM', // SMTP認証用のユーザー名
      pass: 'BL7p/U18YqPDNayL3/X5/Haqxz0Svshbk8jcHWkOIs9j', // SMTP認証用のパスワード
    },
  });

  // メール内容
  const mailOptions = {
    from: 'noreply@yu-cco.com',           // 送信元のメールアドレス
    to: 'yuki2082710@gmail.com',           // 受信者のメールアドレス
    subject: 'テストメール',               // メールの件名
    text: 'これはテストメールです。',    // メールの本文
  };

  // メール送信
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('メールが送信されました: ' + info.response);
  } catch (error) {
    console.error('メール送信中にエラーが発生しました: ' + error.message);
  }
}

// テストメールを送信
sendTestEmail();
