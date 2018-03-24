jest.mock('src/features/user-data/models/UserDataMap');

import {getOpaqueId} from 'src/features/user-data/services/UserDataMap';

describe('getOpaqueId', () => {
  it('should throw error', async () => {
      try {
        getOpaqueId('invalid', 'test');
      } catch (err) {
        expect(err.message).toBe('mock-findFindAll error');
      }
  });

  it('should return valid opaqueId', async () => {
    expect(await getOpaqueId('testUserId', 'testVendorDataType')).toBe('testOpaqueId');
  });
});
