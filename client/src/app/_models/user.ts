import { Photo } from "./photo";

export interface User {
    id: number;
    username: string;
    token: string;
    photoUrl: string | undefined;
    knownAs: string;
    gender: string;
    roles: string[];
    photos: Photo[];
}