import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractCarListComponent } from './contract-car-list.component';

describe('ContractCarListComponent', () => {
  let component: ContractCarListComponent;
  let fixture: ComponentFixture<ContractCarListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractCarListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractCarListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
