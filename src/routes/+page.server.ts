import { getMemberCounts, getLatestMembers } from '$lib/server/supporters';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const [counts, latest] = await Promise.all([getMemberCounts(), getLatestMembers(12)]);
	const success = url.searchParams.get('success') === '1';
	const error = url.searchParams.get('error') ?? null;
	return { counts, latest, success, error };
};
