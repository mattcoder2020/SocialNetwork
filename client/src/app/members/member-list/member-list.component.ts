import { Component, OnInit } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Major, University } from 'src/app/_models/metadatas';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { MetaDataService } from 'src/app/_services/metadata.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members: Member[] = [];
  pagination: Pagination | undefined;
  userParams: UserParams | undefined;
  
  genderList = [
  { value: 'male', display: 'Males' }, 
  { value: 'female', display: 'Females' }]

  universityList : University[] = [];

 majorList: Major[] = [];

  yearRangeList = [
  { value: 1980, display: "1980 - 1989"}, 
  { value: 1990, display: "1990 - 1999"},
  { value: 2000, display: "2000 - 2009"},
  { value: 2010, display: "2010 - 2019"},
  { value: 2020, display: "2020 - 2029"}
]

  constructor(private memberService: MembersService, private metadataService: MetaDataService) {
    this.userParams = this.memberService.getUserParams();
   
  }

  ngOnInit(): void {
    // this.members$ = this.memberService.getMembers();
    this.loadMembers();
    this.getMetadata();
  } 

  getMetadata() {
    this.metadataService.universityAll().subscribe({
      next: response => {
        this.universityList = response;
      }
    })

    this.metadataService.majorAll().subscribe({
      next: response => {
        this.majorList = response;
      }
    })

    // this.metadataService.occupationAll().subscribe({
    //   next: response => {
    //     this.occupations = response;
    //   }
    // })
  }

  loadMembers() {
    if (this.userParams) {
      this.memberService.setUserParams(this.userParams);
      this.memberService.getMembers(this.userParams).subscribe({
        next: response => {
         // if (response.result ) {
            this.members = response.result;
            this.pagination = {
              currentPage: response.currentPage,
              itemsPerPage: response.pageSize,
              totalItems: response.totalCount,
              totalPages: response.totalPages,
            };
         // }
        }

      })
    }
  }

  resetFilters() {
    this.userParams = this.memberService.resetUserParams();
    this.loadMembers();
  }

  pageChanged(event: any) {
    if (this.userParams && this.userParams?.pageNumber !== event.page) {
      this.userParams.pageNumber = event.page;
      this.memberService.setUserParams(this.userParams);
      this.loadMembers();
    }
  }

  UniversityChange(event: any) {
    const isChecked = event.target.checked;

    if (isChecked) {
      if (this.userParams && this.userParams?.UniversityList.indexOf(Number(event.target.value)) === -1) {
        this.userParams.UniversityList.push(Number(event.target.value));
        this.memberService.setUserParams(this.userParams);
      }
    }
    else
    {
      if (this.userParams && this.userParams?.UniversityList.indexOf(Number(event.target.value)) > -1) {
        this.userParams.UniversityList.splice(this.userParams.UniversityList.indexOf(Number(event.target.value)), 1);
        this.memberService.setUserParams(this.userParams);
      }
    }
    this.loadMembers();
    console.log(this.userParams?.UniversityList);
  }
  GenderChange(event: any) {
    const isChecked = event.target.checked;

    if (isChecked) {
      if (this.userParams && this.userParams?.GenderList.indexOf(event.target.value) === -1) {
        this.userParams.GenderList.push(event.target.value);
        this.memberService.setUserParams(this.userParams);
      }
    }
    else
    {
      if (this.userParams && this.userParams?.GenderList.indexOf(event.target.value) > -1) {
        this.userParams.GenderList.splice(this.userParams.GenderList.indexOf(event.target.value), 1);
        this.memberService.setUserParams(this.userParams);
      }
    }
    this.loadMembers();
    console.log(this.userParams?.GenderList);
  }
  
  MajorChange(event: any) {
    const isChecked = event.target.checked;

    if (isChecked) {
      if (this.userParams && this.userParams?.MajorList.indexOf(Number(event.target.value)) === -1) {
        this.userParams.MajorList.push(Number(event.target.value));
        }
      }
    else
    {
      if (this.userParams && this.userParams?.MajorList.indexOf(Number(event.target.value)) > -1) {
        this.userParams.MajorList.splice(this.userParams.UniversityList.indexOf(Number(event.target.value)), 1);
          }
    }
    this.memberService.setUserParams(this.userParams);
    this.loadMembers();
    console.log(this.userParams?.MajorList);
  }

  YearRangeChange(event: any) {
    const isChecked = event.target.checked;

    if (isChecked) {
      if (this.userParams && this.userParams?.YearRangeList.indexOf(Number(event.target.value)) === -1) {
        
        this.userParams.YearRangeList.push(Number(event.target.value));
        }
      }
    else
    {
      if (this.userParams && this.userParams?.YearRangeList.indexOf(Number(event.target.value)) > -1) {
        this.userParams.YearRangeList.splice(this.userParams.UniversityList.indexOf(Number(event.target.value)), 1);
      }
    }
    this.memberService.setUserParams(this.userParams);
    this.loadMembers();
    console.log(this.memberService.getUserParams());
  }
}
