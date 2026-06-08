import { TestBed } from '@angular/core/testing';

import { SiteConfiguration } from './site-configuration';

describe('SiteConfiguration', () => {
  let service: SiteConfiguration;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiteConfiguration);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
