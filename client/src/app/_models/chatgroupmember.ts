import { ChatGroup } from "./chatgroup";
import { Member } from "./member";

export interface chatGroupMember {
    appUserId: number;
    chatGroupId: number;
    member?: Member;
    chatGroup?: ChatGroup;
   
}