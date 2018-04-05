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
        rawContent: report.rawContent,
        parsedContent: report.parsedContent,
        topLevel: report.topLevel,
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
      opaqueId: genotype.opaqueId,
      sampleId: genotype.sampleId,
      source: genotype.source,
      gene: genotype.gene,
      geneFilter: genotype.gene,
      variantCall: genotype.variantCall,
      zygosity: genotype.zygosity,
      startBase: genotype.startBase,
      chromosomeName: genotype.chromosomeName,
      variantType: genotype.variantType,
      quality: genotype.quality,
    }, (error: Error) => {
      if (error) {
        log.error(`Unable to add Genotype ${genotype.opaqueId}. Error JSON: ${JSON.stringify(error, null, 2)}`);
      }
    });
  });
};
