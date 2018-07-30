import { SystemVariantRequirement, SystemVariantRequirementAttributes } from './variant-requirement';
import { rememberFixtures, destroyFixtures } from 'src/common/fixtures';
import { AllowedRefVersion } from 'src/common/variant-constraints';
const cases = require('jest-in-case');

describe('SystemVariantRequirement', function () {
  afterEach(destroyFixtures);
  describe('when saving without providing end and refVersion', async function () {
    let savedSVR: SystemVariantRequirement;

    beforeEach(async function () {
      const svr = new SystemVariantRequirement({
        refName: 'chr1', start: 10
      });
      savedSVR = await svr.saveAsync();
      rememberFixtures(savedSVR);
    });

    it('should add default values for end and refVersion on save', function () {
      
      expect(savedSVR.getValid('end')).toEqual(11);
      expect(savedSVR.getValid('refVersion')).toEqual(AllowedRefVersion);
    });
    
    it('should set the id correctly', function () {
      expect(savedSVR.getValid('id')).toEqual('refIndex:chr1:GRCh37:10:11');
    });
  });

  describe('when saving with end and refVersion', async function () {
    let savedSVR: SystemVariantRequirement;

    beforeEach(async function () {
      const svr = new SystemVariantRequirement({
        refName: 'chr2', start: 90, end: 95, refVersion: 'GRCh38'
      });
      savedSVR = await svr.saveAsync();
      rememberFixtures(savedSVR);
    });

    it('should keep the provided values after save', function () {
      expect(savedSVR.getValid('refName')).toEqual('chr2');
      expect(savedSVR.getValid('start')).toEqual(90);
      expect(savedSVR.getValid('end')).toEqual(95);
      expect(savedSVR.getValid('refVersion')).toEqual('GRCh38');
    });
    
    it('should set the id correctly', function () {
      expect(savedSVR.getValid('id')).toEqual('refIndex:chr2:GRCh38:90:95');
    });
  });
  it('should fail to save if refName is not provided', async function () {
    const obj = new SystemVariantRequirement({ start: 10 });
      
    await expect(obj.saveAsync()).rejects.toBeInstanceOf(Error);
  });

  it('should fail to save if start is not provided', async function () {
    const obj = new SystemVariantRequirement({ refName: 'chr10' });
    await expect(obj.saveAsync()).rejects.toBeInstanceOf(Error);
  });

  cases('should fail to save if attributes are invalid', async (attrs: SystemVariantRequirementAttributes) => {
    const obj = new SystemVariantRequirement(attrs);
    return expect(obj.saveAsync()).rejects.toBeInstanceOf(Error);
  }, [
    { refName: 'asdf', start: 10 },
    { start: -1, refName: 'chr1' },
    { start: 'foo', refName: 'chr1' },
    { refName: 100, start: 10 },
    { start: 10, end: -1, refName: 'chr1' }
  ]);
});
