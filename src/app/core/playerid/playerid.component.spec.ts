import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayeridComponent } from './playerid.component';

describe('PlayeridComponent', () => {
  let component: PlayeridComponent;
  let fixture: ComponentFixture<PlayeridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayeridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayeridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
