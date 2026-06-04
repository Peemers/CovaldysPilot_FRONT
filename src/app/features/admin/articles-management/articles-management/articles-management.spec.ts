import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesManagement } from './articles-management';

describe('ArticlesManagement', () => {
  let component: ArticlesManagement;
  let fixture: ComponentFixture<ArticlesManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticlesManagement],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticlesManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
