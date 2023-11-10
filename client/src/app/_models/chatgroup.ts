import { chatGroupMember } from "./chatgroupmember";
import { Member } from "./member";

export interface ChatGroup {
    id?: number | undefined;
    name: string;
    ownerid: number;
    owner?: Member;
    chatGroupMembers?: chatGroupMember[];
}

