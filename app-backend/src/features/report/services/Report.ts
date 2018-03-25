import {Item} from 'dynogels-promisified';
import {Report, ReportAttributes} from '../../../features/report/models/Report';
import {log} from '../../../logger';
import {CreateArgs} from '../api/resolver';

export async function create(args: CreateArgs): Promise<ReportAttributes> {
  try {
    let reportInstance = await Report.createAsync(args);
    return reportInstance.get();
  } catch (error) {
    log.error(`reportResolver-create: ${error.message}`);
    return error;
  }
}

export async function list(): Promise<ReportAttributes[]> {
  try {
    const result: ReportAttributes[] = [];
    let query = Report.query('report');
    let reportList = await query.execAsync();

    reportList.Items.forEach(function(report: Item<ReportAttributes>) {
      result.push(report.get());
    });

    return result;
  } catch (error) {
    log.error(`reportResolver-list: ${error.message}`);
    return error;
  }
}

export async function get(slug: string): Promise<ReportAttributes> {
  try {
    const reportInstance = await Report.getAsync('report', slug);

    if (!reportInstance) {
      throw new Error('No such record found');
    }

    return reportInstance.get();
  } catch (error) {
    log.error(`reportResolver-get: ${error.message}`);
    return error;
  }
}
