import { getDb } from './db';
import type { LatestMember, RegistrationData } from '$lib/types';

export async function getMemberCounts(): Promise<{ total: number; byCountry: Record<string, number> }> {
	const sql = getDb();
	const rows = await sql<{ country: string; count: string }[]>`
		SELECT country, COUNT(*)::text AS count FROM supporters GROUP BY country
	`;
	const byCountry: Record<string, number> = {};
	let total = 0;
	for (const row of rows) {
		byCountry[row.country] = Number(row.count);
		total += Number(row.count);
	}
	return { total, byCountry };
}

export async function getLatestMembers(limit = 12): Promise<LatestMember[]> {
	const sql = getDb();
	const rows = await sql<{ name: string; country: string }[]>`
		SELECT
			COALESCE(first_name || ' ' || last_name, organization) AS name,
			country
		FROM supporters
		ORDER BY verified_at DESC
		LIMIT ${limit}
	`;
	return rows;
}

export async function createPendingRegistration(token: string, data: RegistrationData): Promise<void> {
	const sql = getDb();
	await sql`
		INSERT INTO pending_registrations (token, data)
		VALUES (${token}, ${sql.json(data)})
	`;
}

export async function confirmRegistration(token: string): Promise<RegistrationData | null> {
	const sql = getDb();
	const rows = await sql<{ data: RegistrationData }[]>`
		SELECT data FROM pending_registrations
		WHERE token = ${token} AND expires_at > NOW()
	`;
	if (rows.length === 0) return null;

	const data = rows[0].data;

	await sql`
		INSERT INTO supporters (type, first_name, last_name, organization, website, country, language, email, newsletter)
		VALUES (
			${data.type},
			${data.firstName ?? null}, ${data.lastName ?? null},
			${data.organization ?? null}, ${data.website ?? null},
			${data.country}, ${data.language}, ${data.email}, ${data.newsletter}
		)
		ON CONFLICT (email) DO NOTHING
	`;

	await sql`DELETE FROM pending_registrations WHERE token = ${token}`;

	return data;
}

export async function emailAlreadyRegistered(email: string): Promise<boolean> {
	const sql = getDb();
	const rows = await sql`SELECT 1 FROM supporters WHERE email = ${email} LIMIT 1`;
	return rows.length > 0;
}
