import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersManagement } from './members-management';

describe('MembersManagement', () => {
  let component: MembersManagement;
  let fixture: ComponentFixture<MembersManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembersManagement],
    }).compileComponents();

    fixture = TestBed.createComponent(MembersManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
