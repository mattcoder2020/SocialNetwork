import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpTransportType, HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Group } from '../_models/group';
import { Message } from '../_models/message';
import { User } from '../_models/user';
import { BusyService } from './busy.service';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';
import { AccountService } from './account.service';
import { ChatGroupMessage } from '../_models/chatgroupmessage';
import { ChatGroup } from '../_models/chatgroup';

@Injectable({
  providedIn: 'root'
})
export class ChatGroupMessageService {
  baseUrl = environment.apiUrl;
  hubUrl = environment.hubUrl;
  private hubConnection?: HubConnection;
  private messageThreadSource = new BehaviorSubject<ChatGroupMessage[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();
  user?: User ;

  constructor(private accountService: AccountService, private http: HttpClient, private busyService: BusyService, ) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) this.user = user;
      }
    });
  }

  async createHubConnection(force: boolean = false): Promise<void> {  
    if (this.hubConnection != undefined && force == false) {  
      return new Promise<void>((resolve, reject) => {
        console.log ("no need to create new hub connection");
        resolve();
      });
       
      }
    else {
      return new Promise<void>((resolve, reject) => {  
            this.hubConnection = new HubConnectionBuilder()  
                .withUrl(this.hubUrl + 'message', {  
                    accessTokenFactory: () => this.user == undefined ? "" : this.user.token,  
                    transport: HttpTransportType.WebSockets  
                })  
                .withAutomaticReconnect()  
                .build();  
  
            this.hubConnection.start()  
                .then(() => {  
                  //Received batch of message that ocurred during user offine
                    this.hubConnection?.on('ReceiveChatGroupMessageThread', messages => {  
                        this.messageThreadSource.next(messages);  
                    });  
  
                    this.hubConnection?.on('NewChatGroupMessageReceived', message => {  
                        this.messageThread$.pipe(take(1)).subscribe({  
                            next: messages => {  
                                this.messageThreadSource.next([...messages, message]);  
                            }  
                        });  
                    });  
  
                    this.busyService.idle();  
                    resolve(); // Resolve the Promise when everything is set up.  
                })  
                .catch(error => {  
                    console.log(error);  
                    reject(error); // Reject the Promise if there is an error.  
                });  
        });
      }  
    
  }

 
 //Backend API: https://localhost:5001/api/messages
  getMessages(pageNumber: number, pageSize: number, container: string) {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('Container', container);
    return getPaginatedResult<Message[]>(this.baseUrl + 'messages', params, this.http);
  }

  //
  getMessageThread(username: string) {
    return this.http.get<Message[]>(this.baseUrl + 'messages/thread/' + username);
  }
  
  //register to the chat group and get ready to receive messages from the same group
  async registerGroupChatByGroupId(chatgroup: ChatGroup) {
          this.hubConnection?.invoke('SubscribeToChatGroupByGroupName', 
          chatgroup.id)
          .catch(error => console.log(error));
        }



  async sendChatGroupMessage(chatgroupid: number, senderid: number, content: string) {
    return this.hubConnection?.invoke('SendMessageToChatGroup', {chatgroupid:chatgroupid, senderid:senderid, content:content})
      .catch(error => console.log(error));
  }


  deleteMessage(id: number) {
    return this.http.delete(this.baseUrl + 'messages/' + id);
  }

  
  stopHubConnection() {
      if (this.hubConnection) {
          this.messageThreadSource.next([]);
          this.hubConnection.stop();
      }
 }

}
