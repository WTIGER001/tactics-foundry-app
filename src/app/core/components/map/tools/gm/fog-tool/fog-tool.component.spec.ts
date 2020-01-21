import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FogToolComponent } from './fog-tool.component';

describe('FogToolComponent', () => {
  let component: FogToolComponent;
  let fixture: ComponentFixture<FogToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FogToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FogToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
