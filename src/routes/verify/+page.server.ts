import { redirect } from '@sveltejs/kit';
import { confirmRegistration } from '$lib/server/supporters';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get('token');
	if (!token) {
		throw redirect(303, '/?error=missing_token');
	}

	const data = await confirmRegistration(token);
	if (!data) {
		throw redirect(303, '/?error=invalid_token');
	}

	throw redirect(303, '/?success=1');
};
