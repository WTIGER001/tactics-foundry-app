import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolTabsComponent } from './tool-tabs.component';

describe('ToolTabsComponent', () => {
  let component: ToolTabsComponent;
  let fixture: ComponentFixture<ToolTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
