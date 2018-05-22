/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as AWS from 'aws-sdk';
import {Handler, Context, Callback, S3CreateEvent} from 'aws-lambda';
import {Genotype} from 'src/services/genotype/models';
import {log} from 'src/logger';

interface GA4GH {
  referenceName: string;
  attributes: {
    sample: {[key: string]: string};
    variant: {[key: string]: string};
    variant_call: {[key: string]: string};
    source:  string;
  };
}

export const vcfIngester: Handler = (event: S3CreateEvent, context: Context, callback: Callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const sourceBucket: string = event.Records[0].s3.bucket.name;
  const sourceKey: string = event.Records[0].s3.object.key;
  const opaqueId: string = sourceKey.split('-')[0];

  const s3: AWS.S3 = new AWS.S3();

  s3.getObject({
    Bucket: sourceBucket,
    Key: sourceKey
  }, (err: Error, data: {Body: string}) => {
    if (err) {
      log.error(`genotypeIngester S3 ERROR: ${err.message}`);
      return;
    }

    try {
      const parsedJSON: GA4GH[] = JSON.parse(data.Body);
      parsedJSON.forEach((ga4gh: GA4GH) => {
        const ga4ghAttributes: GA4GH['attributes'] = ga4gh && ga4gh.attributes;

        log.info(`Creating entry for opaqueID: ${opaqueId} & gene: ${ga4ghAttributes.variant.gene_symbol}`);

        Genotype.createAsync({
          opaqueId,
          sampleId: ga4ghAttributes.sample.id,
          source: ga4ghAttributes.source,
          gene: ga4ghAttributes.variant.gene_symbol,
          variantCall: ga4ghAttributes.variant_call.systematic_name,
          zygosity: JSON.stringify(ga4ghAttributes.variant_call),
          startBase: '--',
          chromosome: ga4gh.referenceName,
          variantType: ga4ghAttributes.variant.type,
          quality: '--',
        });
      });

      log.info('Entries created for uploaded file.');
    } catch (error) {
      log.error(`Error: ${error.message}`);
    }
  });
};

export async function rawDataUpload(event: S3CreateEvent, context: Context, callback: Callback) {

  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const rawDataBucket = event.Records[0].s3.bucket.name;
    const rawDataFilename = event.Records[0].s3.object.key;

    const ecs = new AWS.ECS();

    const params: AWS.ECS.Types.RunTaskRequest = {
      launchType: 'FARGATE',
      taskDefinition: process.env.TASK_NAME,
      count: 1,
      overrides: {
        containerOverrides: [
          {
            name: process.env.ECS_CONTAINER_NAME,
            environment: [
              {
                name: 'S3_RAW_DATA_BUCKET',
                value: rawDataBucket
              },
              {
                name: 'S3_BUCKET_GENETICS_VCF',
                value: process.env.S3_BUCKET_GENETICS_VCF
              },
              {
                name: 'GENOTYPE_RAW_FILENAME',
                value: rawDataFilename
              }
            ]
          }
        ]
      }
    };

    await ecs.runTask(params).promise();
    log.info(`ECS TASK TRIGGERED FOR ${rawDataFilename}`);
  } catch (error) {
    log.error(`Error Occurred: ${error}`);
  }
}
