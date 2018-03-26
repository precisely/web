import {ReportAttributes} from '../Report';
import {reportData} from '../../../../__tests__/constants/reportData';

function mockReport() {
  return {
    createAsync: (data: ReportAttributes) => {
      return { get: (): ReportAttributes => data };
    },
    query: () => {
      return {
        execAsync: () => {
          return { Items: [{ get: function () { return reportData; } }] };
        }
      };
    },
    getAsync: (report: string, slug: string) => {
      return {
        get: (): ReportAttributes => reportData
      };
    },
    __resetReportMock: () => {
      Report = mockReport();
    }
  };
}

export let Report = mockReport();
