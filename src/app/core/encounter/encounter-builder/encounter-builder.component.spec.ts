import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncounterBuilderComponent } from './encounter-builder.component';

describe('EncounterBuilderComponent', () => {
  let component: EncounterBuilderComponent;
  let fixture: ComponentFixture<EncounterBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncounterBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncounterBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
