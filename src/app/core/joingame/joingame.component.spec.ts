import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoingameComponent } from './joingame.component';

describe('JoingameComponent', () => {
  let component: JoingameComponent;
  let fixture: ComponentFixture<JoingameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoingameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoingameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
