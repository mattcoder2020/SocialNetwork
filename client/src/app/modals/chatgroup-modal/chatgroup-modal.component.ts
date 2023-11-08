import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-chatgroup-modal',
  templateUrl: './chatgroup-modal.component.html',
  styleUrls: ['./chatgroup-modal.component.css']
})
export class ChatgroupModalComponent implements OnInit {
  isedit: boolean = false;
  chatgroupname = '';
  allusers: any[] = [];
  selectedUsers: any[] = [];

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit(): void {
  }

  updateChecked(checkedValue: string) {
    const index = this.selectedUsers.indexOf(checkedValue);
    index !== -1 ? this.selectedUsers.splice(index, 1) : this.selectedUsers.push(checkedValue);
  }

}
