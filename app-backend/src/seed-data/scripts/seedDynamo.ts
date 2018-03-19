/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as fs from 'fs';
import * as path from 'path';
import * as AWS from 'aws-sdk';
import {ReportAttributes} from '../../report-service/models/Report';
import {GenotypeAttributes} from '../../genotype-service/models/Genotype';
import {addEnvironmentToTableName} from '../../utils';

AWS.config.update({
  region: process.env.REACT_APP_AWS_AUTH_REGION,
  credentials: new AWS.SharedIniFileCredentials({ profile: process.env.NODE_ENV + '-profile-precisely' })
});

/* istanbul ignore next */
export const dynamodbDocClient = () => { 
  const connectionOptions: AWS.DynamoDB.Types.ClientConfiguration = {
    endpoint: process.env.DB === 'local' ? 'http://localhost:8000' : 'https://dynamodb.us-east-1.amazonaws.com'
  };
  
  return new AWS.DynamoDB.DocumentClient(connectionOptions);
};

const jsonPath = path.join(__dirname, '../data/');

export const seedReport = () => {
  const docClient = dynamodbDocClient();
  const tableName = addEnvironmentToTableName('precisely-report', '01');
  const allReports: ReportAttributes[] = JSON.parse(fs.readFileSync(jsonPath + 'ReportData.json', 'utf8'));

  allReports.forEach((report: ReportAttributes) => {
    const ReportParams = {
      TableName: tableName,
      Item: {
        id: report.id,
        title: report.title,
        slug: report.slug,
        raw_content: report.raw_content,
        parsed_content: report.parsed_content,
        top_level: report.top_level,
        genes: report.genes
      },
    };

    docClient.put(ReportParams, (err: Error) => {
      if (err) {
        console.log(
          'Unable to add Report',
          report.id,
          '. Error JSON:',
          JSON.stringify(err, null, 2)
        );
      }
    });
  });
};

export const seedGenotype = () => {
  const docClient = dynamodbDocClient();
  const tableName = addEnvironmentToTableName('precisely-genotype', '01');
  const allGenotypes: GenotypeAttributes[] = JSON.parse(fs.readFileSync(jsonPath + 'GenotypeData.json', 'utf8'));

  allGenotypes.forEach((genotype: GenotypeAttributes) => {
    const GenotypeParams = {
      TableName: tableName,
      Item: {
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
      },
    };

    docClient.put(GenotypeParams, (err: Error) => {
      if (err) {
        console.log(
          'Unable to add Genotype',
          genotype.opaque_id,
          '. Error JSON:',
          JSON.stringify(err, null, 2)
        );
      }
    });
  });
};
