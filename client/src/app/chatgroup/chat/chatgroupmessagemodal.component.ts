import { NgForm } from '@angular/forms';
import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChatGroup } from 'src/app/_models/chatgroup';
import { ChatGroupMessageService } from 'src/app/_services/chatgroupmessage.service';
import { AccountService } from 'src/app/_services/account.service';
import { User } from 'src/app/_models/user';
import { Member } from 'src/app/_models/member';
import { take } from 'rxjs';
import { id } from '@swimlane/ngx-datatable';
import { ChatGroupMessage } from 'src/app/_models/chatgroupmessage';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-ChatGroupMessageModal',
  templateUrl: './chatgroupmessagemodal.component.html',
  styleUrls: ['./chatgroupmessagemodal.component.css']
})
export class ChatGroupMessageModal implements OnInit
{
  public chatgroup: ChatGroup
  @ViewChild('messageForm') messageForm?: NgForm
  @Input() username: string ="";
  messageContent = '';
  localMessageThread: ChatGroupMessage[] = [];
  loading = false;
  user: User;

  constructor(public messageService: ChatGroupMessageService, private accountService: AccountService, public bsModalRef: BsModalRef) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) {
          this.user = user;
        }
      }
    })

    this.messageService.messageThread$.subscribe({
      next: messages => {
        this.localMessageThread = [];
        for (let i = 0; i < messages.length; i++) {
          var senderId = messages[i].senderId;
          var chatGroupMember = this.chatgroup.chatGroupMembers.find(x => x.appUserId == senderId);
          messages[i].senderPhotoUrl = chatGroupMember.member.photos[0]?.url;
          if (messages[i].senderPhotoUrl == undefined) {
            messages[i].senderPhotoUrl = "../../../assets/user.png";
          }
          messages[i].senderName = chatGroupMember.member.knownAs;
          this.localMessageThread.push(messages[i]);
        }
        //this.localMessageThread.sort((a, b) => (a.messageSent < b.messageSent) ? 1 : -1);
      }
    });

  }

  ngOnInit(): void {
    this.messageService.createHubConnection(true)
      .then(() => { this.messageService.registerGroupChatByGroupId(this.chatgroup); });
  }
  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }


  userIsSender(message: ChatGroupMessage): boolean {
    return message.senderId == this.user.id;
  }

  sendMessage() {
    if (!this.user || !this.chatgroup) return;
    this.loading = true;
    this.messageService.createHubConnection()
        .then(() => {this.messageService.sendChatGroupMessage(this.chatgroup.id, this.user.id, this.messageContent)})
        .then(() => {this.messageForm?.reset();})
        .finally(() => this.loading = false);
  }
 
}

