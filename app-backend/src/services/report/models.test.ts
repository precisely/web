/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */
import { isArray } from 'util';

import {rememberFixtures, destroyFixtures, resetAllTables} from 'src/common/fixtures';

import {Report, calculateReportRequirements} from './models';
import { Parser } from './services/smart-report';

describe('Report model', function () {
  beforeAll(resetAllTables);

  describe('findUniqueSlug', function () {
    afterEach(destroyFixtures);

    it('should find a slug when no slug exists', async function () {
      const slug = await Report.findUniqueSlug('foo');
      expect(slug).toEqual('foo');
    });

    it('should find an alternative slug when the slug exists', async () => {
      const report = new Report({
        title: 'foo',
        ownerId: 'user123'
      });
      const savedReport = await report.saveAsync();
      rememberFixtures(savedReport);
      const slug = await Report.findUniqueSlug('foo');
      expect(slug).toMatch(/^foo-\d+/);
    });
  });

  describe('a report with simple markdown', function () {
    let savedReport: Report;

    beforeAll(async function () {
      const report = new Report({
        title: 'Hello this is a new report',
        content: '# This is the initial content',
        ownerId: 'user123'
      });
      savedReport = await report.saveAsync();
      rememberFixtures(savedReport);
    });
    afterAll(destroyFixtures);

    it('should be an instance of a report', () => {
      expect(savedReport).toBeInstanceOf(Report);
    });

    it('should have content set to the initial content', () => {
      expect(savedReport.getValid('content')).toEqual('# This is the initial content');
    });

    it('should have a slug based on the title', () => {
      expect(savedReport.get('slug')).toMatch(/^hello-this-is-a-new-report/);
    });

    it('should not change the slug when updating an existing report', async () => {
      savedReport.set({title: 'foo'});
      const updatedReport = await savedReport.saveAsync();
      expect(updatedReport.get('slug')).toMatch(/^hello-this-is-a-new-report/);
    });

    describe('when published', function () {
      let publishedReport: Report;

      beforeAll(async function () {
        publishedReport = await savedReport.publish();
      });

      it('should contain the content as published content', () => {
        expect(publishedReport.getValid('publishedContent')).toEqual('# This is the initial content');
      });

      it('should contain a parsed form of the markdown content in publishedElements', async () => {
        expect(publishedReport.get('publishedElements')).toEqual([
          { blocks: [ '<h1>This is the initial content</h1>'], type: 'text', reduced: false }
        ]);
      });

      it('should update the publishedElements when publishing an existing report with new content', async () => {
        savedReport.set({content: '# This is UPDATED content'});
        const updatedReport = await savedReport.saveAsync();
        
        // before publishing - publishedElements is as before
        expect(updatedReport.getValid('publishedElements')).toEqual([
          { blocks: [ '<h1>This is the initial content</h1>'], type: 'text', reduced: false }
        ]);

        await updatedReport.publish();

        expect(updatedReport.getValid('publishedElements')).toEqual([
          { blocks: [ '<h1>This is UPDATED content</h1>'], type: 'text', reduced: false }
        ]);
      });
    });
  });

  describe('content containing errors', function () {
    afterEach(destroyFixtures);

    it('should save successfully', async function () {
      const report = new Report({
        title: 'Report with error',
        content: 'First Line OK\n12345{<}This is text after the error',
        ownerId: 'user123'
      });

      const savePromise = report.saveAsync();
      rememberFixtures(report);
      await expect(savePromise).resolves.toBeInstanceOf(Report);
    });

    it('should throw an error when an attempt is made to publish', async () => {
      const report = new Report({
        title: 'Report with error',
        content: 'First Line OK\n12345{<}This is text after the error',
        ownerId: 'user123'
      });

      await report.saveAsync();
      rememberFixtures(report);

      const publishPromise = report.publish();
      await expect(publishPromise).rejects.toBeInstanceOf(Error);
      await expect(publishPromise).rejects.toHaveProperty('errors.0.location.lineNumber', 2);
      await expect(publishPromise).rejects.toHaveProperty('errors.0.location.columnNumber', 7);
    });
  });

  describe('publishing content containing variants', function () {
    afterEach(destroyFixtures);

    it('should have variantIndexes set correctly', async function () {
      const report = new Report({
        title: 'Report with variant function',
        content: `<AnalysisPanel>
                    <Analysis case={ variantCall("chr1.37p13:g.[10A>T];[10=]") }/>
                    <Analysis case={ variantCall("chr2.37p13:g.[20A>T];[20=]") }/>
                  </AnalysisPanel>`,
        ownerId: 'user123'
      });
      const savedReport = await report.saveAsync();
      rememberFixtures(savedReport);

      await savedReport.publish();

      const variantIndexes = savedReport.get('variantIndexes');
      expect(variantIndexes).toBeDefined();
      expect(variantIndexes).toEqual([
        { refName: 'chr1', refVersion: '37p13', start: 10 },
        { refName: 'chr2', refVersion: '37p13', start: 20 }
      ]);
    });
  });
  
  describe('helper methods', function () {
    describe('calculateReportRequirements', function () {
      it('should collect variants in the __svnVariantRequirements key of the context', function () {
        const {elements, errors} = Parser.parse(
          `<AnalysisPanel>
            <Analysis case={ variantCall("chr1.37p13:g.[10A>T];[10=]") }/>
            <Analysis case={ variantCall("chr2.37p13:g.[20A>T];[20=]") }/>
          </AnalysisPanel>`);
        const {variantIndexes} = calculateReportRequirements(elements);
        expect(variantIndexes).toBeDefined();
        expect(isArray(variantIndexes)).toBeTruthy();
        expect(variantIndexes).toHaveLength(2);
        expect(variantIndexes).toEqual([
          { refName: 'chr1', refVersion: '37p13', start: 10 },
          { refName: 'chr2', refVersion: '37p13', start: 20 }
        ]);
      });
    });
  });
});
