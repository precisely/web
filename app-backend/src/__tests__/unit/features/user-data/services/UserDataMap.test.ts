jest.mock('../../../../../features/user-data/models/UserDataMap');

import {getOpaqueId} from '../../../../../features/user-data/services/UserDataMap';
import {log} from '../../../../../logger';

describe('getOpaqueId', function() {
  log.error = jest.fn();

  it('should log and throw error when no user found', async function() {
      try {
        await getOpaqueId('empty', 'test');
      } catch (err) {
        expect(err.message).toBe('No such user found');
        expect(log.error).toBeCalledWith('userDataMap-getOpaqueId: No such user found');
      }
  });

  it('should return valid opaqueId', async function() {
    expect(await getOpaqueId('testUserId', 'testVendorDataType')).toBe('testOpaqueId');
  });
});
