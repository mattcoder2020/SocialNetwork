import { ChatGroup } from "./chatgroup";

export interface ChatGroupMessage {
    id: number;
    senderId: number;
    chatGroupId: number;
    content: string;
    messageSent: Date;
    senderPhotoUrl: string;
    senderName: string;

}
