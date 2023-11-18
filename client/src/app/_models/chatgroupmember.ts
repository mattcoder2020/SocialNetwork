import { ChatGroup } from "./chatgroup";
import { Member } from "./member";

export interface chatGroupMember {
    appuserid: number;
    chatGroupId: number;
    member?: Member;
    chatGroup?: ChatGroup;
   
}