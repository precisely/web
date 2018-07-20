import {Report} from 'src/services/report/models';
import {addVariants} from 'src/services/variant-call/test-helpers';
import {destroyFixtures, addFixtures} from 'src/common/fixtures';

import {Personalizer} from './service';
import { addReportPersonalizationFixtures } from 'src/services/report/services/personalizer/fixtures';

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
        const result = await addReportPersonalizationFixtures();
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
  });
});
