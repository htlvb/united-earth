export interface RegistrationData {
	type: 'p' | 'o';
	firstName?: string;
	lastName?: string;
	organization?: string;
	website?: string;
	country: string;
	language: string;
	email: string;
	newsletter: boolean;
}

export interface MemberCounts {
	total: number;
	byCountry: Record<string, number>;
}

export interface LatestMember {
	name: string;
	country: string;
}
