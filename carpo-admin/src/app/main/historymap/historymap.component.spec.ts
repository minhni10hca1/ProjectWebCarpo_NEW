import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorymapComponent } from './historymap.component';

describe('HistorymapComponent', () => {
  let component: HistorymapComponent;
  let fixture: ComponentFixture<HistorymapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistorymapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorymapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
