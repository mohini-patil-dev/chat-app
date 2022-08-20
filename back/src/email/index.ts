import nodemailer, { Transporter } from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
        user: process.env.EMAIL_AUTH_USER,
        pass: process.env.EMAIL_AUTH_PASSWORD,
    },
});

class EmailHelper {
    transporter: Transporter;

    constructor(transporter: Transporter) {
        this.transporter = transporter;
    }

    private async sendEmail({
        to,
        html,
        subject,
    }: {
        to: string;
        html: string;
        subject: string;
    }) {
        await this.transporter.sendMail({
            from: '"Talkative" <auth@talkative.com>',
            to,
            html,
            subject,
        });
    }

    async sendVerifyEmail({
        to,
        verifyEmailToken,
    }: {
        to: string;
        verifyEmailToken: string;
    }) {
        await this.sendEmail({
            to,
            subject: 'Verify Your Email',
            html: `
				<h1>Talkative</h1>
				<p>
					To reset your password, please click on the link below:
				</p>
				<a href="${process.env.FRONT_URL}/verify-email?token=${verifyEmailToken}">
					Verify Email
				</a>
			`,
        });
    }
}

export const Email = new EmailHelper(transporter);
