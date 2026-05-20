import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavContent } from './sidenav-content';

describe('SidenavContent', () => {
  let component: SidenavContent;
  let fixture: ComponentFixture<SidenavContent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidenavContent],
    }).compileComponents();

    fixture = TestBed.createComponent(SidenavContent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
