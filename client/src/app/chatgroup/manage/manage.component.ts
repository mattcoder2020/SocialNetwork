
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
  temp = [];
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
  bsModalRef: BsModalRef<ChatgroupModalComponent> = new BsModalRef<ChatgroupModalComponent>();
  confirmmodalRef?: BsModalRef;
  @ViewChild(DatatableComponent) table?: DatatableComponent;
  message: string;
  groupmembers: User[];
  

  constructor(private chatgroupService: ChatgroupService, 
    private fb: FormBuilder, 
    private accountService: AccountService,
    private modalService: BsModalService,
    private toastr: ToastrService) {

    this.chatgroupForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.chatgroupUpdateForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) {
          this.user = user;
        }
      }
    })
  }

  ngOnInit() {
    this.chatgroupService.getAllChatGroupsByOwnerName(this.user.username).subscribe(chatgroups => {
      this.chatgroups = chatgroups;
      this.rows = chatgroups;
      this.temp = [...chatgroups];
    });
  }
  showMemberPhotos(chatgroup: ChatGroup) {
    this.chatgroupService.getMembersByGroupById(chatgroup.id).subscribe
    ({ next: users => {
      this.groupmembers = users;
      this.showTooltip = true;
  
  }})}
  
  hideMemberPhotos() {
    this.showTooltip = false;
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
          return chatGroupMember;});
        // if this is a new chatgroup, create it
        if (chatgroup &&this.bsModalRef.content?.isedit === false) {
        this.chatgroupService.createChatGroup(chatgroup).subscribe(
          {next:chatgroupid=>
            {
              chatgroup.id = chatgroupid;
              chatgroup.owner = {} as Member;
              chatgroup.owner.userName = this.user.username  ;
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
            return chatGroupMember;});
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
              {this.chatgroups[index] = chatgroup;
               this.toastr.success('Chatgroup updated successfully');}
            }
          );
        }
      }})
    }

  enterChatgroup(cg: ChatGroup ) {}
  updateChatgroup(cg: ChatGroup ) {
    if (this.chatgroupUpdateForm.value.id !== undefined) {
      this.chatgroupService.updateChatGroup(this.chatgroupUpdateForm.value).subscribe(
        chatgroup => {
          const index = this.chatgroups?.findIndex(c => c.id === chatgroup.id);
          if (this.chatgroups && index !== undefined && index !== null) {
            this.chatgroups[index] = chatgroup;
            this.rows = [...this.chatgroups];
          }
          this.chatgroupUpdateForm.reset();
        });
    }
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

  onSelect({ selected }: any) {
    this.selectedChatgroup = selected[0];
    if (this.selectedChatgroup && this.selectedChatgroup.id && this.selectedChatgroup.owner) {
    this.chatgroupUpdateForm.patchValue({
      id: this.selectedChatgroup.id,
      name: this.selectedChatgroup.name,
      owner: this.selectedChatgroup.owner
    });
    }
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter(function (d) {
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
}


  

