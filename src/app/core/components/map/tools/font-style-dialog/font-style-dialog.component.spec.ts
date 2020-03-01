import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FontStyleDialogComponent } from './font-style-dialog.component';

describe('FontStyleDialogComponent', () => {
  let component: FontStyleDialogComponent;
  let fixture: ComponentFixture<FontStyleDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FontStyleDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FontStyleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
