import { json } from '@sveltejs/kit';
import { getMemberCounts, getLatestMembers } from '$lib/server/supporters';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const [counts, latest] = await Promise.all([getMemberCounts(), getLatestMembers(12)]);
	return json({ ...counts, latest });
};
