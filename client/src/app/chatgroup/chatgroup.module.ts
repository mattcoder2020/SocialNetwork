import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Routes } from '@angular/router';
import { ManageComponent } from './manage/manage.component';
import { ChatGroupMessageModal } from './chat/chatgroupmessagemodal.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../_modules/shared.module';



const routes: Routes = [
    {path: '', component: ManageComponent},
  ]
@NgModule({
  declarations: [
    ManageComponent,
    ChatGroupMessageModal,
    ChatGroupMessageModal
  ],
  imports: [
    CommonModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatIconModule,
    NgxDatatableModule,
    SharedModule,
    RouterModule.forChild(routes)
   ],
   exports: [RouterModule]
})
export class ChatgroupModule { }
