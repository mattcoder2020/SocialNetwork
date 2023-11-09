import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ChatGroup } from 'src/app/_models/chatgroup';

@Component({
  selector: 'app-chatgroup-modal',
  templateUrl: './chatgroup-modal.component.html',
  styleUrls: ['./chatgroup-modal.component.css']
})
export class ChatgroupModalComponent implements OnInit {
  isedit: boolean = false;
  title: string = '';
  chatgroup: ChatGroup ;
  allusers: any[] = [];
  selectedUsers: any[] = [];

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit(): void {
    if (this.isedit && this.chatgroup) {
      this.title = 'Edit Chat Group ' + this.chatgroup.name;
    }
    else
      this.title = 'Create Chat Group';
  }

  updateChecked(checkedValue: string) {
    const index = this.selectedUsers.indexOf(checkedValue);
    index !== -1 ? this.selectedUsers.splice(index, 1) : this.selectedUsers.push(checkedValue);
  }

 

}
