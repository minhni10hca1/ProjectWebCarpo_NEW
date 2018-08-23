import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCalculatorComponent } from './home-calculator.component';

describe('HomeCalculatorComponent', () => {
  let component: HomeCalculatorComponent;
  let fixture: ComponentFixture<HomeCalculatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeCalculatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
