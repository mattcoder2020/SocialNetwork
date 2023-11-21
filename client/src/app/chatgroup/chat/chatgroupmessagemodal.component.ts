import { NgForm } from '@angular/forms';
import { Message } from 'src/app/_models/message';
import { MessageService } from 'src/app/_services/message.service';
import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChatGroup } from 'src/app/_models/chatgroup';

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

  constructor(public messageService: MessageService) { }

  ngOnInit(): void {
  }

  sendMessage() {
    if (!this.username) return;
    this.loading = true;
    this.messageService.createHubConnection()
        .then(() => {this.messageService.sendMessage(this.username, this.messageContent)})
        .then(() => {this.messageForm?.reset();})
        .finally(() => this.loading = false);
  }
 
}

