import { Component, OnInit } from '@angular/core';
import { ChatGroup } from 'src/app/_models/chatgroup';
import { ChatgroupService } from 'src/app/_services/chatgroup.service';
import { MatTableDataSource } from '@angular/material/table'; 
import { MatPaginator } from '@angular/material/paginator'; 
import { MatSort } from '@angular/material/sort'; 
import { MatDialog } from '@angular/material/dialog'; 
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  chatgroups?: ChatGroup[];
  chatgroup?: ChatGroup;
  chatgroupForm: any;
  chatgroupUpdateForm: any;
  chatgroupDeleteForm: any;
  chatgroupJoinForm: any;
  chatgroupLeaveForm: any;
  chatgroupInviteForm: any;
  chatgroupAcceptInviteForm: any;

  constructor(private chatgroupService: ChatgroupService) { }

  ngOnInit() {
    this.chatgroupService.getChatgroups().subscribe(chatgroups => {
      this.chatgroups = chatgroups;
    });
  }

  createChatgroup() {
    this.chatgroupService.createChatgroup(this.chatgroupForm.value).subscribe(chatgroup => {
      this.chatgroups.push(chatgroup);
      this.chatgroupForm.reset();
    });
  }

  updateChatgroup() {
    this.chatgroupService.updateChatgroup(this.chatgroupUpdateForm.value).subscribe(chatgroup => {
      const index = this.chatgroups.findIndex(c => c.id === chatgroup.id);
      this.chatgroups[index] = chatgroup;
      this.chatgroupUpdateForm.reset();
    });
  }

  deleteChatgroup() {
    this.chatgroupService.deleteChatgroup(this.chatgroupDeleteForm.value).subscribe(() => {
      const index = this.chatgroups.findIndex(c => c.id === this.chatgroupDeleteForm.value.id);
      this.chatgroups.splice(index, 1);
      this.chatgroupDeleteForm.reset();
    });
  }

  joinChatgroup() {
    this.chatgroupService.joinChatgroup(this.chatgroupJoinForm.value).subscribe(chatgroup => {
      const index = this.chatgroups.findIndex(c => c.id === chatgroup.id);
      this.chatgroups[index] = chatgroup;
      this.chatgroupJoinForm.reset();
    });
  }

  leaveChatgroup() {
    this.chatgroupService.leaveChatgroup(this.chatgroupLeaveForm.value).subscribe(chatgroup => {
      const index = this.chatgroups.findIndex(c => c.id === chatgroup.id);
      this.chatgroups[index] = chatgroup;
      this.chatgroupLeaveForm.reset();
    });
  }

  inviteToChatgroup() {
    this.chatgroupService.inviteToChatgroup(this.chatgroupInviteForm.value).subscribe(chatgroup => {
      const index = this.chatgroups.findIndex(c => c.id === chatgroup.id);
      this.chatgroups[index] = chatgroup;
      this.chatgroupInviteForm.reset();
    });
  }

  acceptChatgroupInvite() {
    this.chatgroupService.acceptChatgroupInvite(this.chatgroupAcceptInviteForm.value).subscribe(chatgroup => {
      const index = this.chatgroups.findIndex(c => c.id === chatgroup.id);
      this.chatgroups[index] = chatgroup;
      this.chatgroupAcceptInviteForm.reset();
    });
  }
}


  
}
