import * as fs from 'fs';
import * as path from 'path';

export function reportContent(reportName: string) {
  const filePath = path.join(__dirname, `${reportName}.md`);
  const buffer = fs.readFileSync(filePath);
  return buffer.toString('utf-8');
}
