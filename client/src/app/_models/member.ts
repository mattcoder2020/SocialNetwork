import { Photo } from "./photo";

export interface Member {
    yearOfGraduate?: Date;
    id: number;
    universityId: number;
    majorId: number;
    userName: string;
    photoUrl: string;
    age: number;
    knownAs: string;
    created: Date;
    lastActive: Date;
    gender: string;
    introduction: string;
    lookingFor: string;
    interests: string;
    city: string;
    country: string;
    photos: Photo[];
}