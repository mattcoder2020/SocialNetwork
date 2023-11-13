import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ChatGroup } from 'src/app/_models/chatgroup';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin.service';
import { ChatgroupService } from 'src/app/_services/chatgroup.service';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-chatgroup-modal',
  templateUrl: './chatgroup-modal.component.html',
  styleUrls: ['./chatgroup-modal.component.css']
})
export class ChatgroupModalComponent implements OnInit {
  isedit: boolean = false;
  title: string = '';
  chatgroup: ChatGroup ;
  allusers: User[] = [];
  selectedUsers: User[] = [];
  initselectedUsers: User[] = [];

  // Define an event emitter for when the chat group is saved
  chatGroupSaved: EventEmitter<ChatGroup> = new EventEmitter<ChatGroup>();

  constructor(public bsModalRef: BsModalRef, 
    private adminService: AdminService, 
    private chatgroupService: ChatgroupService) {

    this.adminService.getUsersWithRoles().subscribe
    ({ next: users => this.allusers = users });
    

   }

  ngOnInit(): void {

    this.chatgroupService.getMembersByGroupById(this.chatgroup.id).subscribe
    
    ({ next: users => {this.selectedUsers = users;this.initselectedUsers = this.selectedUsers.slice(); } });


    if (this.isedit && this.chatgroup) {
      this.title = 'Edit Chat Group ' + this.chatgroup.name;
    }
    else{
      this.chatgroup = {} as ChatGroup;
      this.title = 'Create Chat Group';
    }
  }

  updateChecked(checkedValue: User) {
    
    console.log('initselecteduser - before checkupdate' + this.initselectedUsers.values()); 
    const index = this.selectedUsers.findIndex (e=>e.id == checkedValue.id)
    index !== -1 ? this.selectedUsers.splice(index, 1) : this.selectedUsers.push(checkedValue);
    console.log('initselecteduser - after checkupdate' + this.initselectedUsers.values()); 

  }

  updateName(event: any) {
    this.chatgroup.name = event.target.value;
  }

  Checked(user: User) {
    return this.selectedUsers.findIndex (e=>e.id == user.id) !== -1;
  }
  

  saveChatGroup() {
         // Emit the chatGroupSaved event with the saved chat group
        this.chatGroupSaved.emit(this.chatgroup);
        // Close the modal
        this.bsModalRef.hide();
      
  }
}
 


