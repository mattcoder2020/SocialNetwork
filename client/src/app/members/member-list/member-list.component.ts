import { Component, OnInit } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  // members$: Observable<Member[]> | undefined;
  members: Member[] = [];
  pagination: Pagination | undefined;
  userParams: UserParams | undefined;
  genderList = [{ value: 'male', display: 'Males' }, { value: 'female', display: 'Females' }]
  universityList = [{ value: 1, display: 'Harvard University'}, 
  { value: 2, display: 'Stanford University'}, 
  { value: 3, display: 'Harvard University'},
  { value: 4, display: 'University of Cambridge'},
  { value: 5, display: 'University of Oxford'}]

 majorList = [{ value: 1, display: 'Computer Science'}, 
  { value: 2, display: 'Psychology'}, 
  { value: 3, display: 'Finance'},
  { value: 4, display: 'Business'},
  { value: 5, display: 'Economics'}]

  yearRangeList = [
  { value: 1980, display: "1980 - 1989"}, 
  { value: 1990, display: "1990 - 1999"},
  { value: 2000, display: "2000 - 2009"},
  { value: 2010, display: "2010 - 2019"},
  { value: 2020, display: "2020 - 2029"}
]

  constructor(private memberService: MembersService) {
    this.userParams = this.memberService.getUserParams();
  }

  ngOnInit(): void {
    // this.members$ = this.memberService.getMembers();
    this.loadMembers();
  }

  loadMembers() {
    if (this.userParams) {
      this.memberService.setUserParams(this.userParams);
      this.memberService.getMembers(this.userParams).subscribe({
        next: response => {
          if (response.result && response.pagination) {
            this.members = response.result;
            this.pagination = response.pagination;
          }
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
      if (this.userParams && this.userParams?.UniversityList.indexOf(event.target.value) === -1) {
        this.userParams.UniversityList.push(event.target.value);
        this.memberService.setUserParams(this.userParams);
      }
    }
    else
    {
      if (this.userParams && this.userParams?.UniversityList.indexOf(event.target.value) > -1) {
        this.userParams.UniversityList.splice(this.userParams.UniversityList.indexOf(event.target.value), 1);
        this.memberService.setUserParams(this.userParams);
      }
    }
    this.loadMembers();
    console.log(this.userParams?.UniversityList);
  }

  MajorChange(event: any) {
    const isChecked = event.target.checked;

    if (isChecked) {
      if (this.userParams && this.userParams?.MajorList.indexOf(event.target.value) === -1) {
        this.userParams.MajorList.push(event.target.value);
        }
      }
    else
    {
      if (this.userParams && this.userParams?.MajorList.indexOf(event.target.value) > -1) {
        this.userParams.MajorList.splice(this.userParams.UniversityList.indexOf(event.target.value), 1);
          }
    }
    this.memberService.setUserParams(this.userParams);
    this.loadMembers();
    console.log(this.userParams?.MajorList);
  }

  YearRangeChange(event: any) {
    const isChecked = event.target.checked;

    if (isChecked) {
      if (this.userParams && this.userParams?.YearRangeList.indexOf(event.target.value) === -1) {
        this.userParams.YearRangeList.push(event.target.value);
        }
      }
    else
    {
      if (this.userParams && this.userParams?.YearRangeList.indexOf(event.target.value) > -1) {
        this.userParams.YearRangeList.splice(this.userParams.UniversityList.indexOf(event.target.value), 1);
      }
    }
    this.memberService.setUserParams(this.userParams);
    this.loadMembers();
    console.log(this.userParams?.YearRangeList);
  }
}
