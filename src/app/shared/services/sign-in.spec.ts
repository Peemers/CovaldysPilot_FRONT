import { TestBed } from '@angular/core/testing';

import { SignIn } from './sign-in';

describe('SignIn', () => {
  let service: SignIn;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignIn);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
