export interface RegistrationData {
	type: 'p' | 'o';
	designation: string;
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
	designation: string;
	country: string;
}
