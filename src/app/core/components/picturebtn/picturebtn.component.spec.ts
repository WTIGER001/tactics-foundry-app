import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PicturebtnComponent } from './picturebtn.component';

describe('PicturebtnComponent', () => {
  let component: PicturebtnComponent;
  let fixture: ComponentFixture<PicturebtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PicturebtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PicturebtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
