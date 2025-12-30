"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendMail = async (to, subject, htmlTemplate, imageUrl) => {
    const transporter = nodemailer_1.default.createTransport({
        host: 'mail.privateemail.com',
        port: 587, // TLS
        secure: false, // false for 587, true for 465
        auth: {
            user: 'team@churchgps.com',
            pass: 'BibleApp1234' // mailbox or app password
        }
    });
    const mailOptions = {
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
exports.default = sendMail;
