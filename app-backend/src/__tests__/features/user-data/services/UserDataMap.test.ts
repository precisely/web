jest.mock('src/features/user-data/models/UserDataMap');

import {getOpaqueId} from '../../../../features/user-data/services/UserDataMap';

describe('getOpaqueId', function() {
  it('should throw error', async function() {
      try {
        getOpaqueId('invalid', 'test');
      } catch (err) {
        expect(err.message).toBe('mock-findFindAll error');
      }
  });

  it('should return valid opaqueId', async function() {
    expect(await getOpaqueId('testUserId', 'testVendorDataType')).toBe('testOpaqueId');
  });
});
