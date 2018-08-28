// tslint:disable no-any
import * as fs from 'fs';
import * as path from 'path';
import { Report } from 'src/services/report/models';
import { isString } from 'util';
import { batchCreate } from 'src/db/dynamo/batch';

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

  const results = await batchCreate(Report, titles.map(title => reportAttributes({ title, ownerId })));
  console.log('Created reports: %s', results.map(result => {
    return `{slug: ${result.data.slug}, title: ${result.data.title}, id: ${result.data.id})}`;
  }).join(', '));
}

function reportContent(reportName: string) {
  const filePath = path.join(__dirname, `${reportName}.md`);
  const buffer = fs.readFileSync(filePath);
  return buffer.toString('utf-8');
}

function reportAttributes({title, ownerId = 'system'}: {title: string, ownerId: string}) {
  console.log('Creating report "%s" for owner "%s"', title, ownerId);
  return { title, ownerId, content: reportContent(title), seed: true };
}
