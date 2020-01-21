import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavToolComponent } from './fav-tool.component';

describe('FavToolComponent', () => {
  let component: FavToolComponent;
  let fixture: ComponentFixture<FavToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
