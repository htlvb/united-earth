import { json, error } from '@sveltejs/kit';
import { randomBytes } from 'crypto';
import { createPendingRegistration, emailAlreadyRegistered, emailHasPendingRegistration } from '$lib/server/supporters';
import { sendVerificationEmail } from '$lib/server/email';
import { env } from '$env/dynamic/private';
import type { RegistrationData } from '$lib/types';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json().catch(() => null);
	if (!body) throw error(400, 'Invalid JSON');

	// Honeypot: bots fill hidden fields, humans don't
	if (body.phone) return json({ ok: true });

	const { type, firstName, lastName, organization, website, country, language, email, newsletter } = body;

	if (!type || !['p', 'o'].includes(type)) throw error(400, 'Invalid type');
	if (!country?.trim() || country.length > 3) throw error(400, 'Invalid country');
	if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw error(400, 'Invalid email');
	if (type === 'p' && (!firstName?.trim() || !lastName?.trim())) throw error(400, 'First and last name required');
	if (type === 'o' && !organization?.trim()) throw error(400, 'Organization name required');

	if (await emailAlreadyRegistered(email)) {
		throw error(409, 'This email is already registered as a supporter');
	}

	// Cooldown: don't resend if a verification email was already sent within the last hour
	if (await emailHasPendingRegistration(email)) {
		return json({ ok: true });
	}

	const data: RegistrationData = {
		type,
		firstName: firstName?.trim() || undefined,
		lastName: lastName?.trim() || undefined,
		organization: organization?.trim() || undefined,
		website: website?.trim() || undefined,
		country: country.trim().toLowerCase(),
		language: language?.trim() || 'en',
		email: email.trim().toLowerCase(),
		newsletter: Boolean(newsletter)
	};

	const token = randomBytes(32).toString('hex');
	await createPendingRegistration(token, data);

	const link = `${env.SITE_URL}/verify?token=${token}`;
	await sendVerificationEmail(data.email, link);

	return json({ ok: true });
};
