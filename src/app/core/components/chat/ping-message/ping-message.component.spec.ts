import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PingMessageComponent } from './ping-message.component';

describe('PingMessageComponent', () => {
  let component: PingMessageComponent;
  let fixture: ComponentFixture<PingMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PingMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PingMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
