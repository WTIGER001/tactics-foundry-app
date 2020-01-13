import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatRollsComponent } from './chat-rolls.component';

describe('ChatRollsComponent', () => {
  let component: ChatRollsComponent;
  let fixture: ComponentFixture<ChatRollsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatRollsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatRollsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
