import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArcChartComponent } from './arc-chart.component';

describe('ArcChartComponent', () => {
  let component: ArcChartComponent;
  let fixture: ComponentFixture<ArcChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArcChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArcChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
