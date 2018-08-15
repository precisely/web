/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 * @Author: Aneil Mallavarapu 
 * @Date: 2018-08-13 15:10:44 
 * @Last Modified by: Aneil Mallavarapu
 * @Last Modified time: 2018-08-13 15:16:44
 */

// This file represent fixtures for reports in the beta product

import { Report } from '../models';
import { reportContent } from './util';
import { addFixtures } from 'src/common/fixtures';

export async function addBetaReportFixtures() {
  const report = new Report({
    ownerId: 'author',
    title: 'mthfr',
    content: reportContent('mthfr')
  });

  return await addFixtures(report);
}
