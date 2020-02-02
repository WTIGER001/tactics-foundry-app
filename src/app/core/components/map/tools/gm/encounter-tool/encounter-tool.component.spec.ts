import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncounterToolComponent } from './encounter-tool.component';

describe('EncounterToolComponent', () => {
  let component: EncounterToolComponent;
  let fixture: ComponentFixture<EncounterToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncounterToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncounterToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
