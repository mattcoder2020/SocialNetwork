import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ChatGroup } from 'src/app/_models/chatgroup';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin.service';
import { ChatgroupService } from 'src/app/_services/chatgroup.service';
import { EventEmitter } from '@angular/core';
import { AccountService } from 'src/app/_services/account.service';
import { take } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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
  closebybutton: boolean = false;
  currentUser: User = {} as User;
  chatgroupForm: FormGroup;

  // Define an event emitter for when the chat group is saved
  chatGroupSaved: EventEmitter<ChatGroup> = new EventEmitter<ChatGroup>();

  constructor(
    private fb: FormBuilder, 
    public bsModalRef: BsModalRef, 
    private adminService: AdminService, 
    private chatgroupService: ChatgroupService,
    private accountService: AccountService) {
      this.chatgroupForm = this.fb.group({
        name: ['', Validators.required]
      });
   }

  ngOnInit(): void {
    //get all users
    this.adminService.getUsersWithRoles().subscribe
    ({ next: users => this.allusers = users });
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) {
          this.currentUser = user;
        }
      }
    });
    //get members of chatgroup if it is edit mode then it shoudl has the id
    if (this.chatgroup?.id){
    this.chatgroupService.getMembersByGroupById(this.chatgroup?.id).subscribe
    ({ next: users => {
      this.selectedUsers = users;
      this.initselectedUsers = this.selectedUsers.slice(); } });
    }
    if (this.isedit && this.chatgroup) {
      this.title = 'Edit ' + this.chatgroup.name;
    }
    else{
      this.chatgroup = {} as ChatGroup;
      this.selectedUsers.push(this.currentUser);
      this.title = 'Create Chat Group';
    }
  }

  updateChecked(checkedValue: User) {
    const index = this.selectedUsers.findIndex (e=>e.id == checkedValue.id)
    index !== -1 ? this.selectedUsers.splice(index, 1) : this.selectedUsers.push(checkedValue);   
  }

  updateName(event: any) {
    this.chatgroup.name = event.target.value;
  }

  Checked(user: User) {
    return this.selectedUsers.findIndex (e=>e.id == user.id) !== -1 
    || user.username == this.currentUser.username;
  }
  

  saveChatGroup() {
        this.closebybutton = true;
        this.bsModalRef.hide();
      
  }
}
 


