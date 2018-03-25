/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as path from 'path';
import * as faker from 'faker';
import {seedCognito} from './seedCognito';
import {vendorDataTypeList} from '../../features/user-data/models/UserDataMap';
import {ReportAttributes} from '../../features/report/models/Report';
import {GenotypeAttributes} from '../../features/genotype/models/Genotype';
import {log} from '../../logger';
const jsonfile = require('jsonfile');

let limit = parseInt(process.argv.pop(), 10);
const jsonPath = path.join(__dirname, '../data/');
const userData: {[key: string]: string}[] = [];
const reportData: ReportAttributes[] = [];
const genotypeData: GenotypeAttributes[] = [];
const cognitoData: {[key: string]: string}[] = [];
const opaqueIdList: string[] = [];
const genesList: string[] = [
  'MTHFR',
  // more genes can be added here
];

const chromosomeNameList: string[] = [
  'chr1',
  // more chromosome names can be added here
];

const variantCallList: string[] = [
  'NC_000001.11:g.36209042A>C',
  'NC_000001.11:g.11796322C>T',
  'NC_000001.11:g.[36209042=];[36209042=]',
  'NC_000001.11:g.[11796322=];[11796322=]',
  'NC_000001.11:g.[36209042=];[36209042A>C]',
  'NC_000001.11:g.[11796322=];[11796322C>T]',
  'NC_000001.11:g.[36209042A>C];[36209042A>C]',
  'NC_000001.11:g.[11796322C>T];[11796322C>T]',
];

/* istanbul ignore else */
if (isNaN(limit)) {
  limit = 10;
}

for (let i = 0; i < limit; i++) {
  opaqueIdList.push(faker.random.uuid());
}

export function removeDuplicate(array: string[]) {
  return Array.from(new Set(array));
}

export function saveJSONFile(fileName: string, data: object[]) {
  jsonfile.writeFileSync(jsonPath + fileName + '.json', data, { spaces: 2 });
  log.info(`${fileName} created successfully.`);
}

export function createParsedContent() { // tslint:disable-next-line:max-line-length
  return `[{"type":"tag","name":"usergenotypeswitch","children":[{"type":"tag","name":"genotypecase","children":[{"type":"text","blocks":["<p>${faker.lorem.sentence()}</p>"]}],"rawName":"GenotypeCase","attrs":{"svn":"${faker.random.arrayElement(variantCallList)}"},"selfClosing":false},{"type":"tag","name":"genotypecase","children":[{"type":"text","blocks":["<p>This is a fallback text.</p>"]}],"rawName":"GenotypeCase","attrs":{},"selfClosing":false}],"rawName":"UserGenotypeSwitch","attrs":{"gene":"${faker.random.arrayElement(genesList)}"},"selfClosing":false}]`;
}

export async function createCognitoDataWithUser(max: number): Promise<string[]> {
  for (let i = 0; i < max; i++) {
    cognitoData.push({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      get email() {
        return faker.internet.email(this.firstName, this.lastName, 'demo-precisely.com');
      },
      password: 'test@12345',
      roles: faker.random.arrayElement(['USER', 'ADMIN'])
    });
  }
  saveJSONFile('CognitoData', cognitoData);

  return await seedCognito();
}

export function createDBData(max: number, userIdList: string[]) {
  for (let i = 0; i < max; i++) {

    userData.push({
      user_id: userIdList[i],
      opaque_id: opaqueIdList[i],
      vendor_data_type: faker.random.arrayElement(vendorDataTypeList)
    });

    reportData.push({
      hashKey: 'report',
      id: faker.random.uuid(),
      title: faker.lorem.sentence(),
      slug: faker.lorem.slug(),
      rawContent: '--', // demo content not yet provided, will be updated
      parsedContent: createParsedContent(),
      topLevel: faker.random.boolean(),
      genes: removeDuplicate(
        Array.from(
          {length: Math.floor(Math.random() * 5) + 1},
          () => faker.random.arrayElement(genesList)
        ))
    });

    genotypeData.push({
      opaqueId: faker.random.arrayElement(opaqueIdList),
      sampleId: '--', // although data type is clear, data format isn't. Will be updated once provided.
      source: '--', // same as above
      gene: faker.random.arrayElement(genesList),
      variantCall: faker.random.arrayElement(variantCallList),
      zygosity: '--', // same as above
      startBase: '--', // same as above
      chromosomeName: faker.random.arrayElement(chromosomeNameList),
      variantType: '--', // same as above
      quality: '--', // same as above
    });
  }

  saveJSONFile('UserData', userData);
  saveJSONFile('ReportData', reportData);
  saveJSONFile('GenotypeData', genotypeData);
}

/* istanbul ignore next */
(async function() {
  if (process.env.NODE_ENV !== 'test') {
    const userIdList = await createCognitoDataWithUser(limit);
    createDBData(limit, userIdList);
  }
})();
