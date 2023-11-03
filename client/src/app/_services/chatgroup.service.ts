import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { ChatGroup } from '../_models/chatgroup';
import { Member } from '../_models/member';
import { environment } from 'src/environments/environment';
import { AccountService } from './account.service';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class ChatgroupService {
  private baseUrl = environment.apiUrl + 'chatgroups';
  user: User | undefined;


  constructor(private http: HttpClient, private accountService: AccountService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) {
          this.user = user;
        }
      }
    })
  }

  // CRUD operations for ChatGroup model
  getAllChatGroups(): Observable<ChatGroup[]> {
    return this.http.get<ChatGroup[]>(this.baseUrl);
  }

  getAllChatGroupsByOwnerId(): Observable<ChatGroup[]> {
    return this.http.get<ChatGroup[]>(this.baseUrl + '/ownerid=' + this.user?.username);
  }

  getChatGroupById(id: string): Observable<ChatGroup> {
    return this.http.get<ChatGroup>(`${this.baseUrl}/${id}`);
  }

  createChatGroup(chatGroup: ChatGroup): Observable<ChatGroup> {
    return this.http.post<ChatGroup>(this.baseUrl, chatGroup);
  }

  updateChatGroup(id: string, chatGroup: ChatGroup): Observable<ChatGroup> {
    return this.http.put<ChatGroup>(`${this.baseUrl}/${id}`, chatGroup);
  }

  deleteChatGroup(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // CRUD operations for Member property in ChatGroup model
  addMemberToChatGroup(chatGroupId: string, member: Member): Observable<Member> {
    return this.http.post<Member>(`${this.baseUrl}/${chatGroupId}/members`, member);
  }

  removeMemberFromChatGroup(chatGroupId: string, memberId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${chatGroupId}/members/${memberId}`);
  }
}
 

