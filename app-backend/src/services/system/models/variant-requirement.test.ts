import { SystemVariantRequirement, SystemVariantRequirementAttributes } from './variant-requirement';
import { rememberFixtures, destroyFixtures, resetAllTables } from 'src/common/fixtures';
import { AllowedRefVersion } from 'src/common/variant-tools';
const cases = require('jest-in-case');

describe('SystemVariantRequirement', function () {
  beforeAll(resetAllTables);

  afterEach(destroyFixtures);
  describe('when saving without providing end and refVersion', async function () {
    let savedSVR: SystemVariantRequirement;

    beforeEach(async function () {
      const svr = new SystemVariantRequirement({
        refName: 'chr1', refVersion: '37p13', start: 10
      });
      savedSVR = await svr.saveAsync();
      rememberFixtures(savedSVR);
    });

    it('should set the id correctly', async function () {
      expect(savedSVR.getValid('id')).toEqual('refIndex:chr1:37p13:10');
    });
  });

  describe('when saving with end and refVersion', async function () {
    let savedSVR: SystemVariantRequirement;

    beforeEach(async function () {
      const svr = new SystemVariantRequirement({
        refName: 'chr2', start: 90, refVersion: '37p13'
      });
      savedSVR = await svr.saveAsync();
      rememberFixtures(savedSVR);
    });

    it('should keep the provided values after save', function () {
      expect(savedSVR.getValid('refName')).toEqual('chr2');
      expect(savedSVR.getValid('start')).toEqual(90);
      expect(savedSVR.getValid('refVersion')).toEqual('37p13');
    });
    
    it('should set the id correctly', function () {
      expect(savedSVR.getValid('id')).toEqual('refIndex:chr2:37p13:90');
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
