import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cotisation } from './cotisation';

describe('Cotisation', () => {
  let component: Cotisation;
  let fixture: ComponentFixture<Cotisation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cotisation],
    }).compileComponents();

    fixture = TestBed.createComponent(Cotisation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
