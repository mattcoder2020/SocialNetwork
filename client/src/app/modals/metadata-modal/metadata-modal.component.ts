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
  selector: 'app-metadata-modal',
  templateUrl: './metadata-modal.component.html',
  styleUrls: ['./metadata-modal.component.css']
})
export class MetaDataModalComponent implements OnInit {
  closebybutton : boolean = false;
  object: any;
  typeName: string = '';
  metadataForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    public bsModalRef: BsModalRef, 
    ) {
      this.metadataForm = this.fb.group({
        name: ['', Validators.required]
      });
   }

  ngOnInit(): void {
   }
  getTypeName(): string {
    return typeof this.object;
  }
  save() {
        this.closebybutton = true;
        this.object!.name = this.metadataForm.get('name')?.value;
        this.bsModalRef.hide();
      
  }
}
 


