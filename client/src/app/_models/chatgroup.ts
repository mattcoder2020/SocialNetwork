import { Member } from "./member";

export interface ChatGroup {
    id: number;
    name: string;
    ownerid: number;
    owner: Member;
    chatGroupMembers: Member[];
}

