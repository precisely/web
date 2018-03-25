import {Report, ReportAttributes} from '../../../../../features/report/models/Report';
import {CreateArgs} from '../../../../../features/report/interfaces';

export const reportData: CreateArgs = {
  title: 'demo-title',
  slug: 'demo-slug',
  genes: ['demo', 'genes'],
  rawContent: 'demo-content'
};

Report.createAsync = jest.fn()
    .mockImplementation(function(data: ReportAttributes) {
      return {get: (): ReportAttributes => data};
    })
    .mockImplementationOnce(function() {throw new Error('createAsync mock error'); });

Report.query = jest.fn()
  .mockImplementation(function() {
    return {
      execAsync: jest.fn(function() {
        return {Items: [{get: function() { return reportData; }}]};
      })
    };
  })
  .mockImplementationOnce(function() {throw new Error('query mock error'); });

Report.getAsync = jest.fn()
  .mockImplementation(function(report: string, slug: string) {
      return {
        get: (): ReportAttributes => reportData
      };
  })
  .mockImplementationOnce(function() { throw new Error('getAsync mock error'); })
  .mockImplementationOnce(function() { return null; });
