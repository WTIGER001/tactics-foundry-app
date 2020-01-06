import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaynameComponent } from './displayname.component';

describe('DisplaynameComponent', () => {
  let component: DisplaynameComponent;
  let fixture: ComponentFixture<DisplaynameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplaynameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplaynameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
