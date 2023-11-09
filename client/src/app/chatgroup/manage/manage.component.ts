
import { Component, OnInit, ViewChild } from '@angular/core';
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
import { AdminService } from 'src/app/_services/admin.service';

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
    { name: 'Actions' }
  ];
  ColumnMode = ColumnMode;
  SortType = SortType;
  bsModalRef: BsModalRef<ChatgroupModalComponent> = new BsModalRef<ChatgroupModalComponent>();

  @ViewChild(DatatableComponent) table?: DatatableComponent;

  constructor(private chatgroupService: ChatgroupService, 
    private fb: FormBuilder, 
    private accountService: AccountService,
    private modalService: BsModalService,
    private adminService: AdminService) {

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
  
  openCreateChatGroupModal() {
    
    this.adminService.getUsersWithRoles().subscribe
    ({ next: users => this.tempallusers = users });


    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        isedit: false,
        allUsers: this.tempallusers,
    
      }
    }
    this.bsModalRef = this.modalService.show(ChatgroupModalComponent, config);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
         const selectedUsers = this.bsModalRef.content?.selectedUsers;
        let chatgroup = this.bsModalRef.content?.chatgroup;
         chatgroup.chatGroupMembers = selectedUsers;
        this.chatgroupService.createChatGroup(chatgroup).subscribe(
          {next:(chatgroup)=>this.chatgroups.push(chatgroup)}
         )}
       
      })
    }
  openUpdateChatGroupModal(chatgroup: ChatGroup) {
    
    this.adminService.getUsersWithRoles().subscribe
    ({ next: users => this.tempallusers = users });

    this.chatgroupService.getMembersByGroupById(chatgroup.id).subscribe
    ({ next: users => this.tempselectedUsers = users });

    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        isedit: true,
        chatgroup: chatgroup,
        allUsers: this.tempallusers,
        selectedUsers: this.tempselectedUsers
      }
    }
    this.bsModalRef = this.modalService.show(ChatgroupModalComponent, config);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        let dirty = false;
        const selectedUsers = this.bsModalRef.content?.selectedUsers;
        if (!this.arrayEqual(selectedUsers!, this.tempselectedUsers)) {
          chatgroup.chatGroupMembers = selectedUsers;
          dirty = true;
        }
        const index = this.chatgroups.findIndex(c => c.id === chatgroup.id);
        if (this.chatgroups[index].name !== chatgroup.name) {
          this.chatgroups[index] = chatgroup;
          this.rows = [...this.chatgroups];
          dirty = true;
        }

        if (dirty) {
          this.chatgroupService.updateChatGroup(chatgroup).subscribe(
            {next:(chatgroup)=>this.chatgroups[index] = chatgroup}
          );
        }
      }})
    }
  openDeleteChatGroupModal() 
  {}
  createChatgroup() {
    this.chatgroupService.createChatGroup(this.chatgroupForm.value).subscribe(chatgroup => {
      this.chatgroups?.push(chatgroup);
      this.rows = [...this.chatgroups];
      this.chatgroupForm.reset();
    });
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

  deleteChatgroup(cg: ChatGroup) {
    if (this.selectedChatgroup && this.selectedChatgroup.id) {
      this.chatgroupService.deleteChatGroup(this.selectedChatgroup.id).subscribe(() => {
        const index = this.chatgroups?.findIndex(c => c.id === this.selectedChatgroup?.id);
        if (this.chatgroups && index !== undefined && index !== null) {
          this.chatgroups.splice(index, 1);
          this.rows = [...this.chatgroups];
        }
        this.selectedChatgroup = undefined;
      });
    }
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


  

