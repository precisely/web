import { VariantCall, Report, SystemVariantRequirement } from './models';

describe('services/models', function () {
  it('should export definitions of the models', function () {
    expect(VariantCall).toBeDefined();
    expect(Report).toBeDefined();
    expect(SystemVariantRequirement).toBeDefined();
  });
});
