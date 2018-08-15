import * as fs from 'fs';

export function reportContent(reportName: string) {
  const buffer = fs.readFileSync(`./${reportName}.md`);
  return buffer.toString('utf-8');
}
