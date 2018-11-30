// tslint:disable no-any
import * as fs from 'fs';
import * as path from 'path';
import { Report, ReportAttributes } from 'src/services/report/models';
import batchPromises = require('batch-promises');
import { UserSampleType } from 'src/services/user-sample/external';
import { ReportContentError } from 'src/services/report/errors';

export const dataFolder = path.resolve(__dirname, '../../../data');
export const reportsFolder = path.join(dataFolder, 'reports');

/**
 * Loads all reports (files with .md) in this directory, assigning ownership to ownerId
 * 
 * @param ownerId 
 */
export async function reportsCommand(ownerId: string = 'system', silent: boolean = false) {  
  const reportsData = listReportFiles();
  const reports = await batchPromises(
    10, reportsData, async (data) => {
      const report = await new Report(reportAttributes({ ...data, ownerId })).saveAsync();
      try {
        const result = await report.publish();
        return result;
      } catch (e) {
        if (e instanceof ReportContentError) {
          console.log('Failed to publish "%s"', data.filename);
          for (const err of e.errors) {
            console.log('\t%s [%s:%s] (%s)', 
              err.message, 
              err.location.lineNumber, 
              err.location.columnNumber,
              err.type);
          }
          return null;
        } else {
          throw e;
        }
      }
    }
  );
  
  if (!silent) {
    console.log('Created %d reports:', reports.length);
    for (const report of reports) {
      if (report) {
        console.log(`{slug: ${report.get('slug')}, title: ${report.get('title')}, id: ${report.get('id')}}`);
      }
    }
  }
}

interface ReportData {
  filename: string;
  title: string;
  subtitle: string;
}

export function listReportFiles(): ReportData[] {
  return <ReportData[]> fs.readdirSync(reportsFolder).map((file: string) => { 
    const mdMatch = /([^~\s]*)\s*(~\s*(.*))?\.md/i.exec(file);
    
    return mdMatch ? { filename: mdMatch[0], title: mdMatch[1], subtitle: mdMatch[3] } : null;
  }).filter(x => x);
}

function reportContent(filename: string) {
  const filePath = path.join(reportsFolder, filename);
  const content = fs.readFileSync(filePath).toString('utf-8');
  return content;
}

function reportAttributes({filename, title, subtitle, ownerId = 'system'}: {
  filename: string, 
  title: string, 
  subtitle: string,
  ownerId: string
}): ReportAttributes {
  
  return { 
    title, subtitle, ownerId, content: reportContent(filename), 
    seed: true, state: 'published', userSampleRequirements: [
    { type: UserSampleType.genetics }
  ] };
}
