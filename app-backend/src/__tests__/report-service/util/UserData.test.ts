import {UserData} from '../../../report-service/api/util/UserData';
import {genotypeResolver} from '../../../genotype-service/api/resolver';
import {userDataMapResolver} from '../../../user-data-map/api/resolver';

const unroll = require('unroll');
unroll.use(it);

describe('UserData tests.', () => {

  genotypeResolver.list = jest.fn();

  userDataMapResolver.get = jest.fn()
    .mockImplementation(() => ({opaqueId: 'demo-id', vendorDataType: 'demo-vendor'}))
    .mockImplementationOnce(() => { throw new Error('No such user record found'); });

  let userData = new UserData('demo-id', 'demo-vendorDataType', ['demo', 'gene']);

  it('should be an instance', () => {
    expect(userData).toBeInstanceOf(UserData);
    expect(userData.genotypes).toBeInstanceOf(Function);
    expect(userData.genes).toEqual(['demo', 'gene']);
    expect(userData.userId).toEqual('demo-id');
    expect(userData.vendorDataType).toEqual('demo-vendorDataType');
  });

  unroll('it should return #action if #case', async (
      done: () => void,
      args: {action: string; case: string}
  ) => {
    try {
      await userData.genotypes();
      expect(genotypeResolver.list).toBeCalledWith({genes: ['demo', 'gene'], opaqueId: 'demo-id'});
    } catch (error) {
      expect(error.message).toBe('No such user record found');
    }
    done();
  }, [
    ['action', 'case'],
    ['Error', 'no user Found'],
    ['genotype list', 'successful']
  ]);

});
