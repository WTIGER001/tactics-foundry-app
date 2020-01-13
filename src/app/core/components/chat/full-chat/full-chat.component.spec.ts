import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullChatComponent } from './full-chat.component';

describe('FullChatComponent', () => {
  let component: FullChatComponent;
  let fixture: ComponentFixture<FullChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
