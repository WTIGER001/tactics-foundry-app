import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridToolComponent } from './grid-tool.component';

describe('GridToolComponent', () => {
  let component: GridToolComponent;
  let fixture: ComponentFixture<GridToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
