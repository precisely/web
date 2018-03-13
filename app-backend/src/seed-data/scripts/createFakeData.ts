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
import {vendorDataTypeList, UserDataMapAttributes} from '../../user-data-map/models/UserDataMap';
import {ReportAttributes} from '../../report-service/models/Report';
import {GenotypeAttributes} from '../../genotype-service/models/Genotype';
const jsonfile = require('jsonfile');

const userData: UserDataMapAttributes[] = [];
const reportData: ReportAttributes[] = [];
const genotypeData: GenotypeAttributes[] = [];
const cognitoData: {[key: string]: string}[] = [];
const opaqueIdList: string[] = [];
const genesList: string[] = [];
const slugList: string[] = [];
const variantCallList: string[] = [];
const jsonPath = path.join(__dirname, '../data/');
let limit = parseInt(process.argv.pop(), 10);

/* istanbul ignore else */
if (isNaN(limit)) {
  limit = 10;
}

for (let i = 0; i < limit; i++) {
  opaqueIdList.push(faker.random.uuid());
  genesList.push(faker.random.alphaNumeric(6).toUpperCase());
  slugList.push(faker.lorem.slug());
  variantCallList.push(faker.lorem.slug());
}

export const removeDuplicate = (array: string[]) => {
  return Array.from(new Set(array));
};

export const saveJSONfile = (fileName: string, data: object[]) => {
  jsonfile.writeFileSync(jsonPath + fileName + '.json', data, { spaces: 2 });
  console.log(fileName, 'created successfully.');
};

export const createParsedContent = () => { // tslint:disable-next-line:max-line-length
  return `[{"type":"tag","name":"usergenotypeswitch","children":[{"type":"tag","name":"genotypecase","children":[{"type":"text","blocks":["<p>${faker.lorem.sentence()}</p>"]}],"rawName":"GenotypeCase","attrs":{"svn":"${faker.random.arrayElement(variantCallList)}"},"selfClosing":false},{"type":"tag","name":"genotypecase","children":[{"type":"text","blocks":["<p>This is a fallback text.</p>"]}],"rawName":"GenotypeCase","attrs":{},"selfClosing":false}],"rawName":"UserGenotypeSwitch","attrs":{"gene":"${faker.random.arrayElement(genesList)}"},"selfClosing":false}]`;
};

export const createCognitoDataWithUser = async (max: number): Promise<string[]> => {
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
  saveJSONfile('CognitoData', cognitoData);
  
  return await seedCognito();
};

export const createDBData = (max: number, userIdList: string[]) => {
  for (let i = 0; i < max; i++) {

    userData.push({
      user_id: userIdList[i],
      opaque_id: opaqueIdList[i],
      vendor_data_type: faker.random.arrayElement(vendorDataTypeList)
    });
  
    reportData.push({
      id: faker.random.uuid(),
      title: faker.lorem.sentence(),
      slug: faker.random.arrayElement(slugList),
      raw_content: '--', // demo content not yet provided, will be updated
      parsed_content: createParsedContent(),
      top_level: faker.random.boolean(),
      genes: removeDuplicate(
        Array.from(
          {length: Math.floor(Math.random() * 5) + 1},
          () => faker.random.arrayElement(genesList)
        )
      )
    });
  
    genotypeData.push({
      opaque_id: faker.random.arrayElement(opaqueIdList),
      sample_id: faker.random.alphaNumeric(10),
      source: '--', // although data type is clear, data format isn't. Will be updated once provided.
      gene: faker.random.arrayElement(genesList),
      variant_call: faker.random.arrayElement(variantCallList),
      zygosity: '--', // same as above
      start_base: '--', // same as above
      chromosome_name: faker.random.alphaNumeric(4).toUpperCase(),
      variant_type: faker.random.word(),
      quality: '--', // same as above
    });
  }

  saveJSONfile('UserData', userData);
  saveJSONfile('ReportData', reportData);
  saveJSONfile('GenotypeData', genotypeData);
};

/* istanbul ignore next */
(async () => {
  if (process.env.NODE_ENV !== 'test') {
    const userIdList = await createCognitoDataWithUser(limit);
    createDBData(limit, userIdList);
  }
})();
