export type TeamLevel = "REGIONAL" | "NATIONAL";

export interface TeamDto {
    id: number;
    name: string;
    level: TeamLevel;
    season: string | null;
    description: string | null;
}

export type HomeAway = "HOME" | "AWAY";

export interface GameDto {
    id: number;
    teamId: number;
    teamName: string;
    opponent: string;
    gameDateTime: string;
    homeAway: HomeAway;
    location: string;
    scoreUs: number | null;
    scoreThem: number | null;
    win: boolean | null;
    conferenceGame: boolean;
    notes: string | null;
}

export interface PlayerDto {
    id: number;
    firstName: string;
    lastName: string;
    jerseyNumber: number | null;
    position: string | null;
    height: string | null;
    gradYear: number | null;
    country: string | null;
    photoUrl: string | null;
    teamId: number;
    teamName: string;
}

export interface StaffMemberDto {
    id: number;
    fullName: string;
    roleTitle: string;
    bio: string | null;
    photoUrl: string | null;
    email: string | null;
    phone: string | null;
}

export interface AuthResponse {
    token: string;
    fullName: string;
    email: string;
}
