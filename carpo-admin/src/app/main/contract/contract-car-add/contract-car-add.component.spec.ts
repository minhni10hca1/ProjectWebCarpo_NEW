import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractCarAddComponent } from './contract-car-add.component';

describe('ContractCarAddComponent', () => {
  let component: ContractCarAddComponent;
  let fixture: ComponentFixture<ContractCarAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractCarAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractCarAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
