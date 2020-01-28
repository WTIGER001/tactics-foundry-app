import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RollDialogComponent } from './roll-dialog.component';

describe('RollDialogComponent', () => {
  let component: RollDialogComponent;
  let fixture: ComponentFixture<RollDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RollDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RollDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
