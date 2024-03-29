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
  private baseUrl = environment.apiUrl + 'chatgroup';
  user: User | undefined;


  constructor(private http: HttpClient){
  }

  // CRUD operations for ChatGroup model
  getAllChatGroups(): Observable<ChatGroup[]> {
    return this.http.get<ChatGroup[]>(this.baseUrl);
  }

  getAllChatGroupsByOwnerName(ownername: string): Observable<ChatGroup[]> {
    return this.http.get<ChatGroup[]>(this.baseUrl + '?owner=' + ownername);
  }

  getAllChatGroupsByOwnerId(ownerid: number): Observable<ChatGroup[]> {
    return this.http.get<ChatGroup[]>(this.baseUrl + '/owner/' + ownerid);
  }

  getChatGroupById(id: number): Observable<ChatGroup> {
    return this.http.get<ChatGroup>(`${this.baseUrl}/${id}`);
  }

  getMembersByGroupById(id: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/membersbychatgroupid/${id}`);
  }

  createChatGroup(chatGroup: ChatGroup): Observable<any> {
    return this.http.post<ChatGroup>(this.baseUrl, chatGroup);
  }

  updateChatGroup(chatGroup: ChatGroup): Observable<ChatGroup> {
    return this.http.put<ChatGroup>(`${this.baseUrl}/${chatGroup.id}`, chatGroup);
  }

  deleteChatGroup(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // CRUD operations for Member property in ChatGroup model
  addMemberToChatGroup(chatGroupId: number, member: Member): Observable<Member> {
    return this.http.post<Member>(`${this.baseUrl}/${chatGroupId}/members`, member);
  }

  removeMemberFromChatGroup(chatGroupId: number, memberId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${chatGroupId}/members/${memberId}`);
  }
}
 

