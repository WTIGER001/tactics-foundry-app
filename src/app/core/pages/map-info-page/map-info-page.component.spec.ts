import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapInfoPageComponent } from './map-info-page.component';

describe('MapInfoPageComponent', () => {
  let component: MapInfoPageComponent;
  let fixture: ComponentFixture<MapInfoPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapInfoPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
