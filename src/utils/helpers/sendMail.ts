import nodemailer from 'nodemailer';

const sendMail = async (to: string, subject: string, htmlTemplate: any, imageUrl?: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'Biblestudykitapp@gmail.com',
            pass: 'jtlo jveb dilx fhlx'
        },
        tls: {
            // Disable TLS certificate validation
            rejectUnauthorized: false
        }
    });

    const mailOptions: { [key: string]: any } = {
        from: 'Biblestudykitapp@gmail.com',
        to,
        subject,
        html: htmlTemplate
    };

    // Add attachment only if imagePath is provided
    if (imageUrl) {
        mailOptions.attachments = [
            {
                path: imageUrl
            }
        ];
    }

    await transporter.sendMail(mailOptions);
};

export default sendMail;
