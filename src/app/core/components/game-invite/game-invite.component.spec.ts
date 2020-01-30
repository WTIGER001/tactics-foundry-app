import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameInviteComponent } from './game-invite.component';

describe('GameInviteComponent', () => {
  let component: GameInviteComponent;
  let fixture: ComponentFixture<GameInviteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameInviteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
