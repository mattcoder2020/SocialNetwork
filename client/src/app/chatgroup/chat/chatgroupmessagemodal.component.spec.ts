import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatGroupMessageModal } from './chatgroupmessagemodal.component';

describe('ChatComponent', () => {
  let component: ChatGroupMessageModal;
  let fixture: ComponentFixture<ChatGroupMessageModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatGroupMessageModal ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatGroupMessageModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
