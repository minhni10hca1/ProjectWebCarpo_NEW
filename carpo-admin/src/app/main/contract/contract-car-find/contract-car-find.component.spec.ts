import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractCarFindComponent } from './contract-car-find.component';

describe('ContractCarFindComponent', () => {
  let component: ContractCarFindComponent;
  let fixture: ComponentFixture<ContractCarFindComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractCarFindComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractCarFindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
