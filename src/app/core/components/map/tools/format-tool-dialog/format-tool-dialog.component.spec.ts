import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatToolDialogComponent } from './format-tool-dialog.component';

describe('FormatToolDialogComponent', () => {
  let component: FormatToolDialogComponent;
  let fixture: ComponentFixture<FormatToolDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatToolDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatToolDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
