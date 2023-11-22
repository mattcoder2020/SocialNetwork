import { NgForm } from '@angular/forms';
import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChatGroup } from 'src/app/_models/chatgroup';
import { ChatGroupMessageService } from 'src/app/_services/chatgroupmessage.service';
import { AccountService } from 'src/app/_services/account.service';
import { User } from 'src/app/_models/user';
import { Member } from 'src/app/_models/member';
import { take } from 'rxjs';
import { id } from '@swimlane/ngx-datatable';

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
  loading = false;
  user: User;

  constructor(public messageService: ChatGroupMessageService, private accountService: AccountService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) {
          this.user = user;
        }
      }
    })
 

  }

  ngOnInit(): void {
    this.messageService.createHubConnection(true)
      .then(() => { this.messageService.registerGroupChatByGroupId(this.chatgroup); });   
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

