import '../__mocks__/Report.mock';
import {create, list, get} from '../../../../../features/report/services/Report';
import {log} from '../../../../../logger';
import {reportData} from '../__mocks__/Report.mock';

const unroll = require('unroll');
unroll.use(it);

describe('Report Services test', () => {

  log.error = jest.fn();

  describe('create tests', () => {
    it('should log and throw error when it occurs', async function() {
      let response = await create(reportData);
      expect(response[`message`]).toEqual('createAsync mock error');
      expect(log.error).toHaveBeenCalledWith('reportResolver-create: createAsync mock error');
    });

    it('should create a new record when there is no error', async function() {
      let response = await create(reportData);
      expect(response).toEqual(reportData);
    });
  });

  describe('list test', function() {

    it('should log and throw error when it occurs', async function() {
      let response = await list();
      expect(response[`message`]).toEqual('query mock error');
      expect(log.error).toHaveBeenCalledWith('reportResolver-list: query mock error');
    });

    it('should return a list of records when successful', async function() {
      let response = await list();
      expect(response).toEqual([reportData]);
    });
  });

  describe('get tests', () => {
    it('should log and throw error when it occurs', async function() {
      let response = await get('demo-slug');
      expect(response[`message`]).toEqual('getAsync mock error');
      expect(log.error).toHaveBeenCalledWith('reportResolver-get: getAsync mock error');
    });

    it('should throw an error when user is not found.', async function() {
      let response = await get('empty');
      expect(response[`message`]).toEqual('No such record found');
      expect(log.error).toHaveBeenCalledWith('reportResolver-get: No such record found');
    });

    it('should return a record when successful', async function() {
      let response = await get('demo-slug');
      expect(response).toEqual(reportData);
    });
  });

});
