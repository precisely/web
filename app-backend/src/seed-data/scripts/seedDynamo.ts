/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as fs from 'fs';
import * as path from 'path';
import {ReportAttributes, Report} from '../../report-service/models/Report';
import {GenotypeAttributes, Genotype} from '../../genotype-service/models/Genotype';
import {log} from '../../logger';

const jsonPath = path.join(__dirname, '../data/');

export const seedReport = () => {
  const allReports: ReportAttributes[] = JSON.parse(fs.readFileSync(jsonPath + 'ReportData.json', 'utf8'));

  allReports.forEach((report: ReportAttributes) => {
    Report.create({
        id: report.id,
        title: report.title,
        slug: report.slug,
        raw_content: report.raw_content,
        parsed_content: report.parsed_content,
        top_level: report.top_level,
        genes: report.genes
    }, (error: Error) => {
      if (error) {
        log.error(`Unable to add Report ${report.id}. Error JSON: ${JSON.stringify(error, null, 2)}`);
      }
    });
  });
};

export const seedGenotype = () => {
  const allGenotypes: GenotypeAttributes[] = JSON.parse(fs.readFileSync(jsonPath + 'GenotypeData.json', 'utf8'));

  allGenotypes.forEach((genotype: GenotypeAttributes) => {
    Genotype.create({
      opaque_id: genotype.opaque_id,
      sample_id: genotype.sample_id,
      source: genotype.source,
      gene: genotype.gene,
      variant_call: genotype.variant_call,
      zygosity: genotype.zygosity,
      start_base: genotype.start_base,
      chromosome_name: genotype.chromosome_name,
      variant_type: genotype.variant_type,
      quality: genotype.quality,
    }, (error: Error) => {
      if (error) {
        log.error(`Unable to add Genotype ${genotype.opaque_id}. Error JSON: ${JSON.stringify(error, null, 2)}`);
      }
    });
  });
};
