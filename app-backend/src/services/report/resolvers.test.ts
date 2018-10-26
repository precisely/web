/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 * @Author: Aneil Mallavarapu 
 * @Date: 2018-08-10 09:50:16 
 * @Last Modified by: Aneil Mallavarapu
 * @Last Modified time: 2018-10-26 07:41:22
 */

// tslint:disable no-any
import { IFieldResolver } from 'graphql-tools';

import { destroyFixtures, rememberFixtures, resetAllTables } from 'src/common/fixtures';

import { Report } from './models';
import {resolvers} from './resolvers';
import { addSimpleReportFixtures } from './fixtures/simple';
import { makeContext } from 'src/services/graphql/test-helpers';
import { AccessDeniedError } from 'src/common/errors';
import { GraphQLContext } from 'src/services/graphql';
import { isString } from 'util';

describe('Report resolver', function () {
  beforeAll(resetAllTables);
  
  describe('createReport', function () {
    afterAll(destroyFixtures);

    it('should create a report if the user is an author', async function () {
      const context = makeContext({ userId: 'someAuthor', roles: ['author']});
      
      const report = await resolvers.Mutation.createReport(
        null, { title: 'create-report-test', content: '# h1'},
        context
      );
      rememberFixtures(report);

      expect(report).toBeInstanceOf(Report);
    });  

    it('should throw an error if the user is not an author', async function () {
      const context = makeContext({ userId: 'someAuthor', roles: ['user']});
      const promise = resolvers.Mutation.createReport(
        null, { title: 'create-report-test', content: '# h1'},
        context
      );
      await expect(promise).rejects.toBeInstanceOf(AccessDeniedError);
      await expect(promise).rejects.toHaveProperty('data.scope', 'report:create');
    });  
  });
  
  describe('updateReport', function () {
    afterAll(destroyFixtures);

    it('should allow the user to save their own report', async function () {
      const report = await new Report({
        ownerId: 'bob',
        title: "Bob's report",
        content: 'initial content'
      }).saveAsync();
      rememberFixtures(report);

      const context = makeContext({ userId: 'bob', roles: ['author']});
      expect(isString(report.get('id'))).toBeTruthy();
      const updatedReport = await resolvers.Mutation.updateReport(
        null, { id: <string> report.get('id'), content: 'updated content'},
        context
      );
      expect(updatedReport.get('id')).toEqual(report.get('id'));
      expect(updatedReport.get('content')).toEqual('updated content');
    });  

    it('should throw an error if the user is not an author', async function () {
      const report = await new Report({
        ownerId: 'bob',
        title: "Bob's report",
        content: 'initial content'
      }).saveAsync();
      rememberFixtures(report);

      // author sally tries to update bob's report
      const context = makeContext({ userId: 'sally', roles: ['author']});
      expect(isString(report.get('id'))).toBeTruthy();
      const promise = resolvers.Mutation.updateReport(
        null, { id: <string> report.get('id'), content: 'updated content'},
        context
      );
      await expect(promise).rejects.toBeInstanceOf(AccessDeniedError);
      await expect(promise).rejects.toHaveProperty('data.scope', 'report:update');
    });  
  });
  
  describe('publishReport', function () {
    afterAll(destroyFixtures);

    it('should allow the user to publish their own report', async function () {
      const report = await new Report({
        ownerId: 'bob',
        title: "Bob's report",
        content: 'initial content'
      }).saveAsync();
      rememberFixtures(report);
      expect(report.get('state')).toEqual('draft');

      const context = makeContext({ userId: 'bob', roles: ['author']});
      expect(isString(report.get('id'))).toBeTruthy();
      const publishedReport = await resolvers.Mutation.publishReport(
        null, { id: report.getValid('id') },
        context
      );
      expect(publishedReport.get('state')).toEqual('published');
    });  

    it('should throw an error if the user is not an author', async function () {
      const report = await new Report({
        ownerId: 'bob',
        title: "Bob's report",
        content: 'initial content'
      }).saveAsync();
      rememberFixtures(report);

      // author sally tries to update bob's report
      const context = makeContext({ userId: 'sally', roles: ['author']});
      expect(isString(report.get('id'))).toBeTruthy();
      const promise = resolvers.Mutation.publishReport(
        null, { id: report.getValid('id') },
        context
      );
      await expect(promise).rejects.toBeInstanceOf(AccessDeniedError);
      await expect(promise).rejects.toHaveProperty('data.scope', 'report:publish');
    });  
  });
  
  describe('personalize', function () {
    let report: Report;
    beforeAll(async () => {
      const fixtures = await addSimpleReportFixtures();
      report = fixtures.report;
    });

    afterAll(destroyFixtures);

    it('should provide a personalized tree representing the report for the current user', async function () {
      const context = makeContext({ userId: 'user-hom10c', roles: ['user']});
      const personalizationResolver = <IFieldResolver<Report, GraphQLContext>> resolvers.Report.personalization;
      const result = await personalizationResolver(report, { userId: 'user-hom10c' }, context, <any> null );
      expect(result).toEqual({
        status: 'ready',
        elements: [
          { type: 'tag', name: 'analysispanel', rawName: 'AnalysisPanel', 
            attrs: { personalize: true }, reduced: true, selfClosing: false, children: [
            { type: 'tag', name: 'analysis', rawName: 'Analysis', attrs: { case: true }, reduced: true, 
              selfClosing: false, children: [
              { type: 'text', blocks: ['<p>Homozygote-C</p>'], reduced: true }
            ]}
          ]}
        ]
      });
    });

    it('should throw an error if a different user requests personalization', async function () {
      // bob is trying to get personalization for user-hom10c
      const context = makeContext({ userId: 'bob', roles: ['user']});
      const personalizationResolver = <IFieldResolver<Report, GraphQLContext>> resolvers.Report.personalization;
      const promise = personalizationResolver(report, { userId: 'user-hom10c' }, context, <any> null);
      await expect(promise).rejects.toBeInstanceOf(AccessDeniedError);
      await expect(promise).rejects.toHaveProperty('data.scope', 'report:read:personalization');
    });
  });
});
