import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPlayersPageComponent } from './select-players-page.component';

describe('SelectPlayersPageComponent', () => {
  let component: SelectPlayersPageComponent;
  let fixture: ComponentFixture<SelectPlayersPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectPlayersPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPlayersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
