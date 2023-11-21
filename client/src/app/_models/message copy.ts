export interface ChatGroupMessage {
    id: number;
    senderId: number;
    content: string;
    dateRead?: Date;
    messageSent: Date;
}
