import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { RolesModalComponent } from 'src/app/modals/roles-modal/roles-modal.component';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin.service';
import { Major } from 'src/app/_models/metadatas';
import { MetaDataModalComponent } from 'src/app/modals/metadata-modal/metadata-modal.component';
import { MetaDataService } from 'src/app/_services/metadata.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-major-management',
  templateUrl: './major-management.component.html',
  styleUrls: ['./major-management.component.css']
})
export class MajorManagementComponent implements OnInit {
  Majors: Major[] = [];
  Major: Major = {};
  bsModalRef: BsModalRef<MetaDataModalComponent> = new BsModalRef<MetaDataModalComponent>();

  constructor(private metadataService: MetaDataService, private modalService: BsModalService
    , private Toastr : ToastrService) { }

  ngOnInit(): void {
    this.metadataService.majorAll().subscribe({  
      next: Majors => this.Majors = Majors
    })
  }

  openModal() {
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        object:  this.Major,
        typeName: 'Major'
      }
    }
    this.bsModalRef = this.modalService.show(MetaDataModalComponent, config);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        if (this.bsModalRef.content?.closebybutton) {
          this.Major = this.bsModalRef.content?.object;
          this.Major.id = this.Majors.length + 1;
          this.metadataService.majorPOST(this.Major!).subscribe({
            next: Major => {this.Majors.push(this.Major);
            this.Toastr.success('new Major added');}
          })
        }
        
    
      }
    })
  }
}
