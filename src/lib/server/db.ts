import postgres from 'postgres';
import { env } from '$env/dynamic/private';

let _sql: ReturnType<typeof postgres> | null = null;

export function getDb() {
	if (!_sql) {
		_sql = postgres(env.DATABASE_URL, { max: 10 });
	}
	return _sql;
}
