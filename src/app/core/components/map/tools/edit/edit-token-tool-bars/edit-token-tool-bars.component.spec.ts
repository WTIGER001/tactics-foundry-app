import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTokenToolBarsComponent } from './edit-token-tool-bars.component';

describe('EditTokenToolBarsComponent', () => {
  let component: EditTokenToolBarsComponent;
  let fixture: ComponentFixture<EditTokenToolBarsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTokenToolBarsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTokenToolBarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
