jest.mock()
import {create, list, get} from "../../../../features/report/services/Report";
import {Report, ReportAttributes} from '../../../../features/report/models/Report';
import {CreateArgs} from "../../../../features/report/api/resolver";
import {log} from "../../../../logger";

const unroll = require('unroll');
unroll.use(it);

describe('Report Services test', () => {

  const commonData: CreateArgs = {
    title: 'demo-title',
    slug: 'demo-slug',
    genes: ['demo', 'genes'],
    rawContent: 'demo-content'
  };

  log.error = jest.fn();

  Report.createAsync = jest.fn()
    .mockImplementation(function(data: ReportAttributes) {
      return {get: (): ReportAttributes => data};
    })
    .mockImplementationOnce(function() {throw new Error('createAsync mock error'); });

  Report.query = jest.fn()
    .mockImplementation(function() {
      return {
        execAsync: jest.fn(function() {
          return {Items: [{get: function() {return commonData}}]};
        })
      };
    })
    .mockImplementationOnce(function() {throw new Error('query mock error'); });

  Report.getAsync = jest.fn()
    .mockImplementation(function(report: string, slug: string) {
      if (slug === 'demo-slug') {
        return {
          get: (): ReportAttributes => commonData
        };
      } else {
        return null;
      }
    })
    .mockImplementationOnce(function() {throw new Error('getAsync mock error'); });

  describe('create tests', () => {
    it('should log and throw error when it occurs', async function() {
      let response = await create(commonData);
      expect(response[`message`]).toEqual('createAsync mock error');
      expect(log.error).toHaveBeenCalledWith('reportResolver-create: createAsync mock error');
    });

    it('should create a new record when there is no error', async function() {
      let response = await create(commonData);
      expect(response).toEqual(commonData);
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
      expect(response).toEqual([commonData]);
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
      expect(response).toEqual(commonData);
    });
  });

});