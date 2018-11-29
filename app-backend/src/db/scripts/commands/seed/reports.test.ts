import {reportsCommand, listReportFiles} from './reports';
import { resetAllTables } from 'src/db/dynamo';
import { Report } from 'src/services/report/models';
import { isString } from 'util';

describe('seed:reports', function () {
  beforeAll(resetAllTables);
  it('should seed reports', async function () {
    const {Count: beforeCount} = await Report.scan().execAsync();
    expect(beforeCount).toEqual(0);
    const reportFiles = listReportFiles();
    expect(reportFiles.length).toBeGreaterThan(0);
    await reportsCommand('system', true);
    const {Count: afterCount, Items} = await Report.scan().execAsync();
    expect(afterCount).toEqual(reportFiles.length);
    expect(Items.every(report => {
      return isString(report.get('title')) &&
             isString(report.get('subtitle')) &&
             !!report.get('publishedElements');
    }));
  });
});
