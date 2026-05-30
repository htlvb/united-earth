import nodemailer from 'nodemailer';
import * as msal from '@azure/msal-node';
import { env } from '$env/dynamic/private';

function getVerificationEmailHtml(link: string): string {
	return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
body, p, div { font-family: Arial, Helvetica, sans-serif; font-size: 16px; }
body { color: #FFFFFF; margin: 0; background-color: #f2f4fb; }
body a { color: #B74E91; text-decoration: none; }
p { margin: 0; padding: 0; }
.container { max-width: 600px; margin: 0 auto; }
.header { background-color: #5e42a6; padding: 30px 10px; font-size: 30px; }
.body { background-color: #B74E91; padding: 35px 50px; text-align: center; }
.button { display: inline-block; background: #fff; color: #B74E91; font-weight: 700; padding: 12px 20px; border-radius: 3px; text-decoration: none; margin-top: 20px; }
.footer { background-color: #B74E91; color: #fff; font-size: 12px; padding: 16px; text-align: center; }
.footer a { color: #fff; }
</style>
</head>
<body>
<div class="container">
  <div class="header">United-Earth2026</div>
  <div class="body">
    <p style="font-size:24px">Email Verification</p>
    <p style="margin-top:20px">Click the link below to confirm your email and join as a supporter.</p>
    <a class="button" href="${link}" target="_blank">Verify Email</a>
  </div>
  <div class="footer">
    HTL Vöcklabruck | Bahnhofstrasse 42 | 4840 Vöcklabruck | Austria |
    <a href="mailto:united-earth2025@htlvb.at">united-earth2025@htlvb.at</a> |
    <a href="https://www.htlvb.at">www.htlvb.at</a>
  </div>
</div>
</body>
</html>`;
}

function getVerificationEmailText(link: string): string {
	return `United-Earth2026\n\nClick the following link to verify your email and join as a supporter:\n${link}\n\nHTL Vöcklabruck | Bahnhofstrasse 42 | 4840 Vöcklabruck | Austria`;
}

async function getAccessToken(): Promise<string> {
	const app = new msal.ConfidentialClientApplication({
		auth: {
			clientId: env.AZURE_CLIENT_ID,
			clientSecret: env.AZURE_CLIENT_SECRET,
			authority: `https://login.microsoftonline.com/${env.AZURE_TENANT_ID}`
		}
	});

	const result = await app.acquireTokenByClientCredential({
		scopes: ['https://outlook.office365.com/.default']
	});

	if (!result?.accessToken) throw new Error('Failed to acquire Azure access token');
	return result.accessToken;
}

export async function sendVerificationEmail(toEmail: string, verificationLink: string): Promise<void> {
	const accessToken = await getAccessToken();
	const from = env.MAIL_FROM;

	const transporter = nodemailer.createTransport({
		host: 'smtp.office365.com',
		port: 587,
		auth: {
			type: 'OAuth2',
			user: from,
			accessToken
		}
	});

	await transporter.sendMail({
		from,
		to: toEmail,
		subject: 'United-Earth2026 — Email Verification',
		text: getVerificationEmailText(verificationLink),
		html: getVerificationEmailHtml(verificationLink)
	});
}
