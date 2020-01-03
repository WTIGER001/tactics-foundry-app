import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeplayeridComponent } from './changeplayerid.component';

describe('ChangeplayeridComponent', () => {
  let component: ChangeplayeridComponent;
  let fixture: ComponentFixture<ChangeplayeridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeplayeridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeplayeridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
