import { Component, OnInit } from '@angular/core';
import { ChatGroup } from 'src/app/_models/chatgroup';
import { ChatgroupService } from 'src/app/_services/chatgroup.service';
import { DataSource} from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table'; 
import { MatPaginator } from '@angular/material/paginator'; 
import { MatSort } from '@angular/material/sort'; 
import { MatDialog } from '@angular/material/dialog'; 
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { Router } from '@angular/router'; 
import { MatIcon } from '@angular/material/icon';


@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  public chatgroups?: ChatGroup[];
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
    this.chatgroupService.getAllChatGroupsByOwnerId().subscribe(chatgroups => {
      this.chatgroups = chatgroups;
    });
  }

  createChatgroup() {
    this.chatgroupService.createChatGroup(this.chatgroupForm.value).subscribe(chatgroup => {
      this.chatgroups?.push(chatgroup);
      this.chatgroupForm.reset();
    });
  }

  updateChatgroup() {
    if (this.chatgroupUpdateForm.value.id !== undefined) {
      this.chatgroupService.updateChatGroup(this.chatgroupUpdateForm.value).subscribe(
        chatgroup => {
          const index = this.chatgroups?.findIndex(c => c.id === chatgroup.id);
          if (this.chatgroups && index !== undefined && index !== null) {
            this.chatgroups[index] = chatgroup;
          }
          this.chatgroupUpdateForm.reset();
        });
    }
  }

  deleteChatgroup() {
    
  }

  enterChatgroup() {
    
  }

  leaveChatgroup() {
    
  }

  inviteToChatgroup() {
    
  }

  acceptChatgroupInvite() {
   
  }
}


  

