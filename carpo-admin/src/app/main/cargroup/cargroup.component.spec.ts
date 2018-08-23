import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargroupComponent } from './cargroup.component';

describe('CargroupComponent', () => {
  let component: CargroupComponent;
  let fixture: ComponentFixture<CargroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
