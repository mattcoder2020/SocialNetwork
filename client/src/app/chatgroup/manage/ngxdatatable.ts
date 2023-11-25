

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
import { ChatGroupMessageModal } from '../chat/chatgroupmessagemodal.component';
import { ChatGroupMessageService } from 'src/app/_services/chatgroupmessage.service';

@Component({
  selector: 'ngxdatatable',
  templateUrl: './ngxdatatable.html'
})
export class ngxdatatable {
  rows = [];

  columns = [{ name: 'Company' }, { name: 'Name' }, { name: 'Gender' }];

  ColumnMode = ColumnMode;
  SortType = SortType;

  constructor() {
    this.fetch(data => {
      this.rows = data;
    });
  }

  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/data/company.json`);

    req.onload = () => {
      const data = JSON.parse(req.response);
      cb(data);
    };

    req.send();
  }
}
