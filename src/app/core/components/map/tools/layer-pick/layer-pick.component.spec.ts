import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerPickComponent } from './layer-pick.component';

describe('LayerPickComponent', () => {
  let component: LayerPickComponent;
  let fixture: ComponentFixture<LayerPickComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayerPickComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerPickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
