import { getMemberCounts, getLatestMembers } from '$lib/server/supporters';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [counts, latest] = await Promise.all([getMemberCounts(), getLatestMembers(12)]);
	return { counts, latest };
};
