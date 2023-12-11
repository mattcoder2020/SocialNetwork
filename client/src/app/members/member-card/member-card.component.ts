import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input() member: Member | undefined;

  constructor(private memberService: MembersService, private toastr: ToastrService, 
      public presenceService: PresenceService, private router: Router) { }

  ngOnInit(): void {
  }

  addLike(member: Member) {
    if (this.memberService.user)
    {
    this.memberService.addLike(member.userName).subscribe({
      next: () => this.toastr.success('You have connect to ' + member.knownAs)
    })
    }
    else
    {
      this.toastr.error('You need to register to continue');
      this.router.navigate(['register']);
      }
    }

    nvigateToMemberDetails(member: Member) {
      if (this.memberService.user == null)
      {
        this.toastr.error('You need to register to continue');
        this.router.navigate(['register']);
        return;
      }
      this.router.navigate(['members', member.userName]);
    }
  }


