
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ChatGroup } from 'src/app/_models/chatgroup';
import { ChatgroupService } from 'src/app/_services/chatgroup.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ColumnMode, SortType } from 'projects/swimlane/ngx-datatable/src/public-api';
import { AccountService } from 'src/app/_services/account.service';
import { take } from 'rxjs';
import { User } from 'src/app/_models/user';
import { ChatgroupModalComponent } from 'src/app/modals/chatgroup-modal/chatgroup-modal.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { chatGroupMember } from 'src/app/_models/chatgroupmember';
import { Member } from 'src/app/_models/member';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ChatGroupMessageModal } from '../chat/chatgroupmessagemodal.component';
import { ChatGroupMessageService } from 'src/app/_services/chatgroupmessage.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: [
    './manage.component.css',
    './material.scss',
    './dark.scss',
    './bootstrap.scss'
  ],
})
export class ManageComponent implements OnInit {
  public chatgroups: ChatGroup[] = [];
  showTooltip = false;
  rows = [];
  public chatgroupForm: FormGroup;
  public chatgroupUpdateForm: FormGroup;
  public selectedChatgroup?: ChatGroup;
  public user: User = {} as User;
  public tempallusers: User[] = [];
  public tempselectedUsers: User[] = [];
  public columns = [
    { name: 'Name' },
    { name: 'Owner' },
    { name: 'Members' },
    { name: 'Actions' }
  ];
  ColumnMode = ColumnMode;
  SortType = SortType;
  message: string;
  groupmembers: User[];
  bsModalRef: BsModalRef<ChatgroupModalComponent> = new BsModalRef<ChatgroupModalComponent>();
  bsModalRefMessaging: BsModalRef<ChatGroupMessageModal> = new BsModalRef<ChatGroupMessageModal>();

  confirmmodalRef?: BsModalRef;
  @ViewChild(DatatableComponent) table?: DatatableComponent;
  
  

  constructor(private chatgroupService: ChatgroupService, 
    private messageService: ChatGroupMessageService,
    private fb: FormBuilder, 
    private accountService: AccountService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private router: Router) {

    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) {
          this.user = user;
        }
      }
    })
  }

  ngOnInit() {
    this.chatgroupService.getAllChatGroupsByOwnerId(this.user.id).subscribe(chatgroups => {
      this.chatgroups = chatgroups;
      this.rows = this.chatgroups;
    });
  }
  
  openCreateChatGroupModal() {
     const config = {
      class: 'modal-dialog-centered',
      initialState: {
        isedit: false
        } }
    
    this.bsModalRef = this.modalService.show(ChatgroupModalComponent, config);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        const selectedUsers = this.bsModalRef.content?.selectedUsers;
        const chatgroup = this.bsModalRef.content?.chatgroup;
        const closebybutton = this.bsModalRef.content?.closebybutton;
        if (closebybutton == false) {return;}
        chatgroup.ownerid = this.user.id;
        chatgroup.chatGroupMembers = selectedUsers.map(user => {
          const chatGroupMember: chatGroupMember = {
            appuserid: user.id,
            chatGroupId: chatgroup.id
          };
          return chatGroupMember;
        });
        // if this is a new chatgroup, create it
        if (chatgroup &&this.bsModalRef.content?.isedit === false) {
        this.chatgroupService.createChatGroup(chatgroup).subscribe(
          {next:chatgroupid=>
            {
              chatgroup.id = chatgroupid;
              chatgroup.ownerid = this.user.id;
              chatgroup.owner = {userName :this.user.username} as Member;
              chatgroup.chatGroupMembers = selectedUsers.map(user => {
                const chatGroupMember: chatGroupMember = {
                  appuserid: user.id,
                  chatGroupId: chatgroup.id,
                  //a trick to add photos to chatgroupmember to render at datatable to avoid round trip to backend
                  member: { 
                    userName: user.username, 
                    id: 0,
                    photoUrl: '',
                    age: 0,
                    knownAs:  user.knownAs,
                    created: null,
                    lastActive: null,
                    gender: null,
                    introduction: null,
                    lookingFor: null,
                    interests: null,
                    city: null,
                    country: null,
                    photos: [{id:0, isMain:true, url: user.photoUrl }] }
                };
                return chatGroupMember;
              });
              this.chatgroups.push(chatgroup);
              this.rows = [...this.chatgroups];
              this.toastr.success('Chatgroup created successfully');}}
         )}
      }})
  }

  openUpdateChatGroupModal(chatgroup: ChatGroup) {
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        isedit: true,
        chatgroup: chatgroup,
      }
    }
    this.bsModalRef = this.modalService.show(ChatgroupModalComponent, config);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        let dirty = false;
        const selectedUsers = this.bsModalRef.content?.selectedUsers;
        const initselectedUsers = this.bsModalRef.content?.initselectedUsers;
        const closebybutton = this.bsModalRef.content?.closebybutton;
        if (closebybutton == false) {return;}
        //if selected users have changed, flag dirty
        if (!this.arrayEqual(selectedUsers, initselectedUsers)) {
          chatgroup.chatGroupMembers = selectedUsers.map(user => {
            const chatGroupMember: chatGroupMember = {
              appuserid: user.id,
              chatGroupId: chatgroup.id
            };
            return chatGroupMember;
          });
          dirty = true;
        }

        const index = this.chatgroups.findIndex(c => c.id === chatgroup.id);
        //if name has changed, flag dirty
        if (this.chatgroups[index].name !== chatgroup.name) {
          this.chatgroups[index] = chatgroup;
          this.rows = [...this.chatgroups];
          dirty = true;
        }
        //if flag dirty, update chatgroup to backend
        if (dirty) {
          this.chatgroupService.updateChatGroup(chatgroup).subscribe(
            {next:()=>
              {
                chatgroup.chatGroupMembers = selectedUsers.map(user => {
                  const chatGroupMember: chatGroupMember = {
                    appuserid: user.id,
                    chatGroupId: chatgroup.id,
                    //a trick to add photos to chatgroupmember to render at datatable to avoid round trip to backend
                    member: { 
                      userName: user.username, 
                      id: 0,
                      photoUrl: '',
                      age: 0,
                      knownAs:  user.knownAs,
                      created: null,
                      lastActive: null,
                      gender: null,
                      introduction: null,
                      lookingFor: null,
                      interests: null,
                      city: null,
                      country: null,
                      photos: [{id:0, isMain:true, url: user.photoUrl }] }
                  };
                  return chatGroupMember;
                });
                this.chatgroups[index] = chatgroup;
               this.toastr.success('Chatgroup updated successfully');}
            }
          );
        }
      }})
    }

  enterChatgroup(chatgroup: ChatGroup ) {
    //this.router.navigateByUrl('/chatgroupmessage');
    console.log(chatgroup.name);
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        chatgroup: chatgroup,
      }
    }
    this.bsModalRefMessaging = this.modalService.show(ChatGroupMessageModal, config);
    this.bsModalRefMessaging.onHide?.subscribe({
      next: () => {
        this.messageService.stopHubConnection();


      }})
  }
  

  openDeleteChatGroupModal(cg: ChatGroup, template: TemplateRef<any>) {
    this.confirmmodalRef = this.modalService.show(template, {class: 'modal-sm'});
    this.confirmmodalRef.onHide.subscribe(() => {
    if(this.message != 'yes') return;
    if (cg && cg.id) {
        this.chatgroupService.deleteChatGroup(cg.id).subscribe(() => {
        const index = this.chatgroups?.findIndex(c => c.id === cg.id);
        this.chatgroups.splice(index, 1);
        this.rows = [...this.chatgroups];
        this.toastr.success('Chatgroup deleted successfully');
        });
       
      }
    });
  }
  
 
  confirm(): void {
    this.message = 'yes';
    this.confirmmodalRef?.hide();
  }
 
  decline(): void {
    this.message = 'no';
    this.confirmmodalRef?.hide();
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.chatgroups.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  private arrayEqual(arr1: any[], arr2: any[]) {
    return JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort());
  }

  public displayButton(chatgroup: ChatGroup) {
    if (chatgroup.ownerid === this.user.id || chatgroup.owner?.id === this.user.id || this.user.roles.includes('Admin') ) {
      return true;
    }
    return false;
}
}


  

