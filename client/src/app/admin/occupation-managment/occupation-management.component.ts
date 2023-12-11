import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Occupation } from 'src/app/_models/metadatas';
import { MetaDataModalComponent } from 'src/app/modals/metadata-modal/metadata-modal.component';
import { MetaDataService } from 'src/app/_services/metadata.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-occupation-management',
  templateUrl: './occupation-management.component.html',
  styleUrls: ['./occupation-management.component.css']
})
export class OccupationManagementComponent implements OnInit {
  Occupations: Occupation[] = [];
  Occupation: Occupation = {};
  bsModalRef: BsModalRef<MetaDataModalComponent> = new BsModalRef<MetaDataModalComponent>();

  constructor(private metadataService: MetaDataService, private modalService: BsModalService
    , private Toastr : ToastrService) { }

  ngOnInit(): void {
    this.metadataService.occupationAll().subscribe({  
      next: Occupations => this.Occupations = Occupations
    })
  }

  openModal() {
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        object:  this.Occupation,
        typeName: 'Occupation'
      }
    }
    this.bsModalRef = this.modalService.show(MetaDataModalComponent, config);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        if (this.bsModalRef.content?.closebybutton) {
          this.Occupation = this.bsModalRef.content?.object;
          this.Occupation.id = this.Occupations.length + 1;
          this.metadataService.occupationPOST(this.Occupation!).subscribe({
            next: Occupation => {this.Occupations.push(this.Occupation);
            this.Toastr.success('new Occupation added');}
          })
        }
        
    
      }
    })
  }
}
