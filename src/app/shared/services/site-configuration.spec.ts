import { TestBed } from '@angular/core/testing';

import { SiteConfigurationService } from './site-configuration';

describe('SiteConfiguration', () => {
  let service: SiteConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiteConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
