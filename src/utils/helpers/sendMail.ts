import nodemailer from 'nodemailer';

const sendMail = async (
  to: string,
  subject: string,
  htmlTemplate: any,
  imageUrl?: string
) => {
  const transporter = nodemailer.createTransport({
    host: 'mail.privateemail.com',
    port: 587, // TLS
    secure: false, // false for 587, true for 465
    auth: {
      user: 'team@churchgps.com',
      pass: 'BibleApp1234' // mailbox or app password
    }
  });

  const mailOptions: any = {
    from: '"Church GPS" <team@churchgps.com>',
    to,
    subject,
    html: htmlTemplate
  };

  if (imageUrl) {
    mailOptions.attachments = [
      {
        filename: 'image.jpg',
        path: imageUrl
      }
    ];
  }

  await transporter.sendMail(mailOptions);
};

export default sendMail;
