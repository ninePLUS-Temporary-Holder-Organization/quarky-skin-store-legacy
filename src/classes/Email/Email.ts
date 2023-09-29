import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport/index.js";

const transporter = nodemailer.createTransport(new SMTPTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
}));
const smtpFrom = process.env.SMTP_FROM; // Reimu <cirno@quarky.skin>
const smtpReplyTo = process.env.SMTP_REPLY_TO;

export default class Email {

    subject: string;
    recipientAddress: string;
    recipientDisplayName: string;
    bodyPlain: string;
    bodyHTML: string;

    constructor(subject, recipientAddress, recipientDisplayName, bodyPlain, bodyHTML) {
        this.subject = subject;
        this.recipientAddress = recipientAddress;
        this.recipientDisplayName = recipientDisplayName;
        this.bodyPlain = bodyPlain;
        this.bodyHTML = bodyHTML
    }

    async send() {
        return await transporter.sendMail({
            from: smtpFrom,
            to: this.recipientAddress,
            subject: this.subject,
            text: this.bodyPlain,
            html: this.bodyHTML,
            replyTo: smtpReplyTo
        })
    }
}