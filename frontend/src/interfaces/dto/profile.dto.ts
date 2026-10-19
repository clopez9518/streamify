export interface ProfileDto {
    id: number;
    name: string;
    avatarUrl: string;
    isKids: boolean;
    userId: number;
}

export interface CreateProfileDto {
    name: string;
    avatarUrl?: string;
    isKids: boolean;
}

export interface AddToMyListDto {
    profileId: string
}