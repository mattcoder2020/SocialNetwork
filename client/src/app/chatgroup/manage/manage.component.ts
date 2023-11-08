
import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatGroup } from 'src/app/_models/chatgroup';
import { ChatgroupService } from 'src/app/_services/chatgroup.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ColumnMode, SortType } from 'projects/swimlane/ngx-datatable/src/public-api';
import { AccountService } from 'src/app/_services/account.service';
import { take } from 'rxjs';
import { User } from 'src/app/_models/user';


@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: [
    './manage.component.css',
    './material.scss',
    '../../../../projects/swimlane/ngx-datatable/src/lib/themes/dark.scss',
    '../../../../projects/swimlane/ngx-datatable/src/lib/themes/bootstrap.scss'
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
  public columns = [
    { name: 'Name' },
    { name: 'Owner' },
    { name: 'Actions' }
  ];
  ColumnMode = ColumnMode;
  SortType = SortType;

  @ViewChild(DatatableComponent) table?: DatatableComponent;

  constructor(private chatgroupService: ChatgroupService, private fb: FormBuilder, private accountService: AccountService) {
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
  
  openCreateChatGroupModal() 
  {}
  openUpdateChatGroupModal() 
  {}
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
}


  

