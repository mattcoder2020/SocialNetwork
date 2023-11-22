export interface ChatGroupMessage {

    id: number;
    senderId: number;
    chatGroupId: number;
    content: string;
    dateRead?: Date;
    messageSent: Date;
    senderPhotoUrl: string;
}
