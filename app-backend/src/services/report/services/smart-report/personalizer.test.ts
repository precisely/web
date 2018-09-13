/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 * @Author: Aneil Mallavarapu 
 * @Date: 2018-08-10 09:50:28 
 * @Last Modified by: Aneil Mallavarapu
 * @Last Modified time: 2018-09-13 10:47:30
 */

const cases = require('jest-in-case');
import { map } from 'lodash';

import {Report} from 'src/services/report/models';
import {destroyFixtures} from 'src/common/fixtures';

import {Personalizer} from './personalizer';
import { addSimpleReportFixtures } from '../../fixtures/simple';
import { addBetaReportFixtures } from 'src/services/report/fixtures/beta';
import { isTagElement } from 'smart-report';

describe('Personalizer', function () {
  describe('constructor', function () {
    it('should accept a report object and a userId string', function () {
      const personalizer = new Personalizer(new Report({}), 'user1');
      expect(personalizer.report).toBeInstanceOf(Report);
      expect(personalizer.userId).toEqual('user1');
    });
  });

  describe('personalize,', function() {
    describe('when there are users with different genotypes for the same SNP,', function() {
      let report: Report;
      beforeAll(async function() {
        const result = await addSimpleReportFixtures();
        report = result.report;
      });

      afterAll(destroyFixtures);

      it('should personalize the content for a wildtype user', async function() {
        const personalizer = new Personalizer(report, 'user-wt10');
        const personalizedDOM = await personalizer.personalize();
        expect(personalizedDOM).toEqual([
          { type: 'tag', name: 'analysisbox', rawName: 'AnalysisBox', attrs: {}, reduced: true, 
            selfClosing: false, children: [
            { type: 'tag', name: 'analysis', rawName: 'Analysis', attrs: { case: true }, reduced: true, 
              selfClosing: false, children: [
              { type: 'text', blocks: ['<p>Wild Type</p>'], reduced: true }
            ]}
          ]}
        ]);
      });
      
      it('should personalize the content for a heterozygotic user with altbase 1', async function() {
        const personalizer = new Personalizer(report, 'user-het10t');
        const personalizedDOM = await personalizer.personalize();
        expect(personalizedDOM).toEqual([
          { type: 'tag', name: 'analysisbox', rawName: 'AnalysisBox', attrs: {}, reduced: true, 
            selfClosing: false, children: [
            { type: 'tag', name: 'analysis', rawName: 'Analysis', attrs: { case: true }, reduced: true, 
              selfClosing: false, children: [
              { type: 'text', blocks: ['<p>Heterozygote-T</p>'], reduced: true }
            ]}
          ]}
        ]);
      });

      it('should personalize the content for a heterozygotic user with altbase 2', async function() {
        const personalizer = new Personalizer(report, 'user-het10c');
        const personalizedDOM = await personalizer.personalize();
        expect(personalizedDOM).toEqual([
          { type: 'tag', name: 'analysisbox', rawName: 'AnalysisBox', attrs: {}, reduced: true, 
            selfClosing: false, children: [
            { type: 'tag', name: 'analysis', rawName: 'Analysis', attrs: { case: true }, reduced: true, 
              selfClosing: false, children: [
              { type: 'text', blocks: ['<p>Heterozygote-C</p>'], reduced: true }
            ]}
          ]}
        ]);
      });

      it('should personalize the content for a user homozygotic for altbase 1', async function() {
        const personalizer = new Personalizer(report, 'user-hom10t');
        const personalizedDOM = await personalizer.personalize();
        expect(personalizedDOM).toEqual([
          { type: 'tag', name: 'analysisbox', rawName: 'AnalysisBox', attrs: {}, reduced: true, 
            selfClosing: false, children: [
            { type: 'tag', name: 'analysis', rawName: 'Analysis', attrs: { case: true }, reduced: true, 
              selfClosing: false, children: [
              { type: 'text', blocks: ['<p>Homozygote-T</p>'], reduced: true }
            ]}
          ]}
        ]);
      });

      it('should personalize the content for a user homozygotic for altbase 2', async function() {
        const personalizer = new Personalizer(report, 'user-hom10c');
        const personalizedDOM = await personalizer.personalize();
        expect(personalizedDOM).toEqual([
            { type: 'tag', name: 'analysisbox', rawName: 'AnalysisBox', attrs: {}, reduced: true, 
            selfClosing: false, children: [
            { type: 'tag', name: 'analysis', rawName: 'Analysis', attrs: { case: true }, reduced: true, 
                selfClosing: false, children: [
                { type: 'text', blocks: ['<p>Homozygote-C</p>'], reduced: true }
            ]}
          ]}
        ]);
      });

      it('should personalize the content for a user with a compound heterozygotic mutation', async function() {
        const personalizer = new Personalizer(report, 'user-cmpnd10');
        const personalizedDOM = await personalizer.personalize();
        expect(personalizedDOM).toEqual([
            { type: 'tag', name: 'analysisbox', rawName: 'AnalysisBox', attrs: {}, reduced: true, 
            selfClosing: false, children: [
            { type: 'tag', name: 'analysis', rawName: 'Analysis', attrs: { case: true }, reduced: true, 
                selfClosing: false, children: [
                { type: 'text', blocks: ['<p>Compound Heterozygote</p>'], reduced: true }
            ]}
          ]}
        ]);
      });
    });

    describe('with beta data', function () {
      let geneReport: Report;
      let genePanelReport: Report;

      beforeAll(async function() {
        const result = await addBetaReportFixtures();
        geneReport = result.geneReport;
        genePanelReport = result.genePanelReport;
      });
      describe('a gene report', function () {  
        it('should parse the report', function () {
          expect(geneReport).toBeDefined();
        });

        it('should personalize the report', async function () {
          const personalizer = new Personalizer(geneReport, 'user-wt');
          const elements = await personalizer.personalize();
          expect(elements).toBeInstanceOf(Array);
          expect(elements.map(elt => [elt.type, isTagElement(elt) ? elt.name : null])).toEqual([
            [ 'text', null],
            [ 'tag', 'topicbar' ],
            [ 'tag', 'genemap'],
            [ 'tag', 'analysisbox' ],
            [ 'text', null ],
            [ 'tag', 'topicbar' ],
            [ 'tag', 'topicbar' ]
          ]);
        });

        cases('should personalize the report for users with different genetics', async function (
          [userId, analysisName]: [string, string]
        ) {
          const personalizer = new Personalizer(geneReport, userId);
          const elements = await personalizer.personalize();
          expect(elements[3]).toMatchObject({
            type: 'tag',
            name: 'analysisbox',
            children: [{
              type: 'tag',
              name: 'analysis',
              attrs: {
                name: analysisName
              }
            }]
          });
        }, [
          [ 'user-wt', 'Wild type' ],
          [ 'user-c677t-het', 'C677T (C;T)' ],
          [ 'user-c677t-hom', 'C677T (T;T)' ],
          [ 'user-a1298c-het', 'A1298C (A;C)' ],
          [ 'user-a1298c-hom', 'A1298C (C;C)' ],
          [ 'user-a1298c-c677t-cpd-het', 'C677T (C;T) A1298C (A;C)' ],
          [ 'user-a1298c-c677t-cpd-hom', 'Unknown' ],
          [ 'user-a1298c-het-c677t-hom', 'Unknown' ],
          [ 'user-a1298c-hom-c677t-het', 'Unknown' ]
        ]);
      });

      describe('a gene panel report', function () {
        
        cases('should contain the correct gene indicators for various users', async (
          [userId, geneStates]: [string, [string, string][]]
          ) => {
          const personalizer = new Personalizer(genePanelReport, userId);
          const elements = await personalizer.personalize();
          const children = map(geneStates, (abnormal, gene) => ({
            type: 'tag',
            name: 'indicator',
            attrs: {
              name: gene,
              state: abnormal ? 'abnormal' : 'normal'
            }
          }));
          expect(elements[1]).toMatchObject({
            type: 'tag',
            name: 'indicatorpanel',
            children
          });
        }, [
          // the user and the state of the indicators (false = green/normal | true = red/abnormal)
          ['user-wt',               { MTHFR: false, CHRN5A: false}],
          ['user-c677t-het',        { MTHFR: true,  CHRN5A: false}],
          ['user-c677t-hom',        { MTHFR: true,  CHRN5A: false}],
          ['user-a1298c-het',       { MTHFR: true,  CHRN5A: false}],
          ['user-a1298c-c677t-cpd-het', { MTHFR: true,  CHRN5A: false}],
          ['user-a1298c-c677t-cpd-hom', { MTHFR: true,  CHRN5A: false}],
          ['user-a1298c-het-c677t-hom', { MTHFR: true,  CHRN5A: false}],
          ['user-a1298c-hom-c677t-het', { MTHFR: true,  CHRN5A: false}],
          ['user-g1192a-het',       { MTHFR: false,  CHRN5A: true}],
          ['user-g1192a-hom',       { MTHFR: false,  CHRN5A: true}],
          ['user-a78573551g-het',   { MTHFR: false,  CHRN5A: true}],
          ['user-a78573551g-hom',   { MTHFR: false,  CHRN5A: true}],
          ['user-a78581651t-het',   { MTHFR: false,  CHRN5A: true}],
          ['user-a78581651t-hom',   { MTHFR: false,  CHRN5A: true}],
          ['user-c667t-het-g1192a-het',   { MTHFR: true,  CHRN5A: true}]
        ]);
      });
    });
  });
});
