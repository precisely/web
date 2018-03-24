import {Report, ReportAttributes} from 'src/features/report/models/Report';
import {log} from 'src/logger';
import {CreateArgs} from '../api/resolver';

export async function create(args: CreateArgs): Promise<ReportAttributes> {
  try {
    let reportInstance = await Report.createAsync(args);
    return reportInstance.get();
  } catch (error) {
    log.error(`: ${error.message}`);
    return error;
  }
}

export async function list(): Promise<ReportAttributes[]> {
  try {
    const result: ReportAttributes[] = [];
    let query = Report.query('report');
    let reportList = await query.execAsync();

    reportList.Items.forEach(report => {
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
