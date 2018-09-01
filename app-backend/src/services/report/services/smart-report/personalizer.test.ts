/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 * @Author: Aneil Mallavarapu 
 * @Date: 2018-08-10 09:50:28 
 * @Last Modified by: Aneil Mallavarapu
 * @Last Modified time: 2018-08-22 12:49:03
 */

const cases = require('jest-in-case');

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

    describe('an actual gene report', function () {
      let report: Report;
      beforeAll(async function() {
        const result = await addBetaReportFixtures();
        report = result.report;
      });

      it('should parse the report', function () {
        expect(report).toBeDefined();
      });

      it('should personalize the report', async function () {
        const personalizer = new Personalizer(report, 'user-wt');
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
        const personalizer = new Personalizer(report, userId);
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
  });
});
