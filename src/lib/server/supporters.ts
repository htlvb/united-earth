import { getDb } from './db';
import type { LatestMember, RegistrationData } from '$lib/types';

export async function getMemberCounts(): Promise<{ total: number; byCountry: Record<string, number> }> {
	const sql = getDb();
	const rows = await sql<{ country: string; count: string }[]>`
		SELECT TRIM(country) AS country, COUNT(*)::text AS count FROM supporters GROUP BY country
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
	return sql<LatestMember[]>`
		SELECT
			COALESCE(
				organization,
				first_name || CASE WHEN last_name IS NOT NULL THEN ' ' || LEFT(last_name, 1) || '.' ELSE '' END
			) AS name,
			TRIM(country) AS country
		FROM supporters
		ORDER BY verified_at DESC
		LIMIT ${limit}
	`;
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
		INSERT INTO supporters (type, first_name, last_name, organization, website, country, language, email)
		VALUES (
			${data.type},
			${data.firstName ?? null}, ${data.lastName ?? null},
			${data.organization ?? null}, ${data.website ?? null},
			${data.country}, ${data.language}, ${data.email}
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

export async function emailHasPendingRegistration(email: string): Promise<boolean> {
	const sql = getDb();
	const rows = await sql`
		SELECT 1 FROM pending_registrations
		WHERE data->>'email' = ${email}
		  AND created_at > NOW() - INTERVAL '1 hour'
		LIMIT 1
	`;
	return rows.length > 0;
}
