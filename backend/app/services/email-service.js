import nodemailer from 'nodemailer';

class EmailService {
	constructor() {
		console.log('EmailService constructor');
	}

	async init() {
		try {
			if (this.initialized) {
				return;
			}

			console.log('EmailService init');

			this.fromAddress = process.env.EMAIL_FROM;

			this.transporter = nodemailer.createTransport({
				host: process.env.SMTP_HOST, 
				port: process.env.SMTP_PORT, 
			});

			this.initialized = true;
		} catch (error) {
			console.error(`Error creating email transporter: ${error.message}`, error);
		}
	}

	async sendEmail(to, subject, body) {
		await this.init();

		console.log('sending Email to', to, 'from', this.fromAddress, 'subject', subject, 'body', body);

		const mailOptions = {
			from: this.fromAddress,
			to,
			subject,
			text: body,
		};

		try {
			const info = await this.transporter.sendMail(mailOptions);
			console.log(`Email sent: ${info.response}`);
		} catch (error) {
			console.error(`Error sending email: ${error.message}`, error);
		}
	}
}

const service = new EmailService();
export default service;
