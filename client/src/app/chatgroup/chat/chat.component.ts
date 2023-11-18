import { NgForm } from '@angular/forms';
import { Message } from 'src/app/_models/message';
import { MessageService } from 'src/app/_services/message.service';
import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit
{
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

