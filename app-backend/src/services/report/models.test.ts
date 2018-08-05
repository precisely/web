/*
* Copyright (c) 2017-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/
import { isArray } from 'util';

import {rememberFixtures, destroyFixtures} from 'src/common/fixtures';
import {AllowedRefVersion} from 'src/common/variant-constraints';

import {Report, calculateReportRequirements} from './models';
import { PreciselyParser } from './parser';
import { VariantCallIndexes } from 'src/services/variant-call/types';

describe('Report model', function () {
  describe('findUniqueSlug', function () {
    afterEach(destroyFixtures);

    it('should find a slug when no slug exists', async function () {
      const slug = await Report.findUniqueSlug('foo');
      expect(slug).toEqual('foo');
    });

    it('should find an alternative slug when the slug exists', async () => {
      const report = new Report({
        title: 'foo',
        content: ' ',
        ownerId: 'user123'
      });
      const savedReport = await report.saveAsync();
      rememberFixtures(savedReport);
      const slug = await Report.findUniqueSlug('foo');
      expect(slug).toMatch(/^foo-\d+/);
    });
  });

  describe('saving content with simple markdown', function () {
    let savedReport: Report;

    beforeAll(async function () {
      const report = new Report({
        title: 'Hello this is a new report',
        content: '# This is a title',
        ownerId: 'user123'
      });
      savedReport = await report.saveAsync();
      rememberFixtures(savedReport);
    });

    afterAll(destroyFixtures);

    it('should be an instance of a report', () => {
      expect(savedReport).toBeInstanceOf(Report);
    });

    it('should have a slug based on the title', () => {
      expect(savedReport.get('slug')).toMatch(/^hello-this-is-a-new-report/);
    });

    it('should contain a parsed form of the markdown content', () => {
      expect(savedReport.get('parsedContent')).toBeDefined();
      expect(JSON.parse(<string> savedReport.get('parsedContent'))).toEqual([
        { blocks: [ '<h1>This is a title</h1>'], type: 'text', reduced: false }
      ]);
    });

    it('should not change the slug when updating an existing report', async () => {
      savedReport.set({title: 'foo'});
      const updatedReport = await savedReport.saveAsync();
      expect(updatedReport.get('slug')).toMatch(/^hello-this-is-a-new-report/);
    });

    it('should update the parsedContent when updating an existing report', async () => {
      savedReport.set({content: '# This is an UPDATED title'});
      const updatedReport = await savedReport.saveAsync();
      
      expect(JSON.parse(updatedReport.getValid('parsedContent'))).toEqual([
        { blocks: [ '<h1>This is an UPDATED title</h1>'], type: 'text', reduced: false }
      ]);
    });
  });

  describe('saving content containing errors', function () {
    afterEach(destroyFixtures);

    it('should return an error', async function () {
      const report = new Report({
        title: 'Report with error',
        content: 'First Line OK\n12345{<}This is text after the error',
        ownerId: 'user123'
      });

      const savePromise = report.saveAsync();
      await expect(savePromise).rejects.toBeInstanceOf(Error);
      await expect(savePromise).rejects.toHaveProperty('location.lineNumber', 2);
      await expect(savePromise).rejects.toHaveProperty('location.columnNumber', 7);
    });
  });

  describe('saving content containing variants', function () {
    afterEach(destroyFixtures);

    it('should have variantCallIndexes set correctly', async function () {
      const report = new Report({
        title: 'Report with variant function',
        content: `<AnalysisBox>
                    <Analysis case={ variant("chr1:g.[10A>T];[10=]") }/>
                    <Analysis case={ variant("chr2:g.[20A>T];[20=]") }/>
                  </AnalysisBox>`,
        ownerId: 'user123'
      });
      const savedReport = await report.saveAsync();
      rememberFixtures(savedReport);

      const variantCallIndexes = report.get('variantCallIndexes');
      expect(variantCallIndexes).toBeDefined();
      expect((<VariantCallIndexes> variantCallIndexes).refIndexes).toEqual([
        { refName: 'chr1', start: 10, refVersion: AllowedRefVersion },
        { refName: 'chr2', start: 20, refVersion: AllowedRefVersion }
      ]);
    });
  });
  describe('helper methods', function () {
    describe('calculateReportRequirements', function () {
      it('should collect variants in the __svnVariantRequirements key of the context', function () {
        const parsedContent = PreciselyParser.parse(
          `<AnalysisBox>
            <Analysis case={ variant("chr1:g.[10A>T];[10=]") }/>
            <Analysis case={ variant("chr2:g.[20A>T];[20=]") }/>
          </AnalysisBox>`);
        const {variantCallIndexes} = calculateReportRequirements(parsedContent);
        expect(variantCallIndexes).toBeDefined();
        expect(isArray(variantCallIndexes.refIndexes)).toBeTruthy();
        expect(variantCallIndexes.refIndexes).toHaveLength(2);
        expect(variantCallIndexes.refIndexes).toEqual([
          { refName: 'chr1', start: 10, refVersion: AllowedRefVersion },
          { refName: 'chr2', start: 20, refVersion: AllowedRefVersion }
        ]);
      });
    });
  });
});
