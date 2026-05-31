import { confirmRegistration } from '$lib/server/supporters';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get('token');
	if (!token) return { ok: false };

	const data = await confirmRegistration(token);
	return { ok: data !== null };
};
