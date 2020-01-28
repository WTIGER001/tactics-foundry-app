import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMarkerComponent } from './edit-marker.component';

describe('EditMarkerComponent', () => {
  let component: EditMarkerComponent;
  let fixture: ComponentFixture<EditMarkerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMarkerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
