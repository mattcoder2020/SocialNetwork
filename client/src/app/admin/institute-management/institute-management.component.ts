import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

import { University } from 'src/app/_models/metadatas';
import { MetaDataService } from 'src/app/_services/metadata.service';
import { MetaDataModalComponent } from 'src/app/modals/metadata-modal/metadata-modal.component';

@Component({
  selector: 'app-institute-management',
  templateUrl: './institute-management.component.html',
  styleUrls: ['./institute-management.component.css']
})
export class InstituteManagementComponent implements OnInit {
  Universitys: University[] = [];
  University: University = {};
  bsModalRef: BsModalRef<MetaDataModalComponent> = new BsModalRef<MetaDataModalComponent>();

  constructor(private metadataService: MetaDataService, private modalService: BsModalService
    , private Toastr : ToastrService) { }

  ngOnInit(): void {
    this.metadataService.universityAll().subscribe({  
      next: universitys => this.Universitys = universitys
    })
  }

  openModal() {
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        object:  this.University,
        typeName: 'University'
      }
    }
    this.bsModalRef = this.modalService.show(MetaDataModalComponent, config);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        if (this.bsModalRef.content?.closebybutton) {
          this.University = this.bsModalRef.content?.object;
          this.University.id = this.Universitys.length + 1;
          this.metadataService.universityPOST(this.University!).subscribe({
            next: university => {this.Universitys.push(this.University);
            this.Toastr.success('new university added');}
          })
        }
        
    
      }
    })
  }

}
