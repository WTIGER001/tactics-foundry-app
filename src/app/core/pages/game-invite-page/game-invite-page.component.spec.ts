import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameInvitePageComponent } from './game-invite-page.component';

describe('GameInvitePageComponent', () => {
  let component: GameInvitePageComponent;
  let fixture: ComponentFixture<GameInvitePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameInvitePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameInvitePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
