"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendMail = async (to, subject, htmlTemplate, imageUrl) => {
    const transporter = nodemailer_1.default.createTransport({
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
    const mailOptions = {
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
exports.default = sendMail;
