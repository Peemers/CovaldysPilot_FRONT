import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsPast } from './events-past';

describe('EventsPast', () => {
  let component: EventsPast;
  let fixture: ComponentFixture<EventsPast>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsPast],
    }).compileComponents();

    fixture = TestBed.createComponent(EventsPast);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
