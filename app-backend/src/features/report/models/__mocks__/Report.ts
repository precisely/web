import {ReportAttributes} from '../Report';
import { reportData } from '../../../../__tests__/constants/reportData';

export function createAsync(data: ReportAttributes) {
  return {get: (): ReportAttributes => data};
}

export function query() {
  return {
    execAsync: () => {
      return {Items: [{get: function() { return reportData; }}]};
    }
  };
}

export function getAsync(report: string, slug: string) {
  return {
    get: (): ReportAttributes => reportData
  };
}

