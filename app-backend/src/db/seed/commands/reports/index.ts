// tslint:disable no-any
import * as fs from 'fs';
import * as path from 'path';
import { Report, ReportAttributes } from 'src/services/report/models';
import { isString } from 'util';
import batchPromises = require('batch-promises');

/**
 * Loads all reports (files with .md) in this directory, assigning ownership to ownerId
 * 
 * @param ownerId 
 */
export async function reportsCommand(ownerId: string = 'system') {
  const titles: any[] = fs.readdirSync(__dirname).map((file: string) => { 
    const mdMatch = /(.*)\.md/i.exec(file);

    return mdMatch ? mdMatch[1] : null;
  }).filter(x => isString(x));

  const reports = await batchPromises(
    10, titles, title => new Report(reportAttributes({ title, ownerId })).saveAsync()
  );
  // publish the reports!
  await batchPromises(10, reports, (report: Report) => report.publish());

  console.log('Created %d reports: %s', reports.length, reports.map(report => {
    return `{slug: ${report.get('slug')}, title: ${report.get('title')}, id: ${report.get('id')})}`;
  }).join(', '));
}

function reportContent(reportName: string) {
  const filePath = path.join(__dirname, `${reportName}.md`);
  const buffer = fs.readFileSync(filePath);
  return buffer.toString('utf-8');
}

function reportAttributes({title, ownerId = 'system'}: {title: string, ownerId: string}): ReportAttributes {
  return { title, ownerId, content: reportContent(title), seed: true, state: 'published' };
}
