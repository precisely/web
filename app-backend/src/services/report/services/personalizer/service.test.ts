import {Report} from 'src/services/report/models';
import {addVariants} from 'src/services/variant-call/test-helpers';
import {destroyFixtures, addFixtures} from 'src/common/fixtures';

import {Personalizer} from './service';

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
        await addVariants(
          { userId: 'user-wt10', refName: 'chr1', start: 10, refBases: 'A', altBases: [ 'T', 'C'], genotype: [0, 0],
            callSetId: 'userwt-23andme' },
          { userId: 'user-het10t', refName: 'chr1', start: 10, refBases: 'A', altBases: [ 'T', 'C'], genotype: [0, 1],
            callSetId: 'userhet10t-23andme' },
          { userId: 'user-het10c', refName: 'chr1', start: 10, refBases: 'A', altBases: [ 'T', 'C'], genotype: [0, 2],
            callSetId: 'userhet10c-23andme' },            
          { userId: 'user-hom10t', refName: 'chr1', start: 10, refBases: 'A', altBases: [ 'T', 'C'], genotype: [1, 1],
            callSetId: 'userhom-23andme' },
          { userId: 'user-hom10c', refName: 'chr1', start: 10, refBases: 'A', altBases: [ 'T', 'C'], genotype: [2, 2],
            callSetId: 'userhomc-23andme' },
          // compound heterozygote:
          { userId: 'user-cmpnd10', refName: 'chr1', start: 10, refBases: 'A', altBases: [ 'T', 'C'], genotype: [1, 2],
            callSetId: 'usercmpd-23andme' }
        );
        report = new Report({
          ownerId: 'author',
          content: `<AnalysisBox>
                      <Analysis case={ variant("chr1:g.[10=];[10=]") }>
                      Wild Type
                      </Analysis>
                      <Analysis case={ variant("chr1:g.[10=];[10A>T]") }>
                      Heterozygote-T
                      </Analysis>
                      <Analysis case={ variant("chr1:g.[10=];[10A>C]") }>
                      Heterozygote-C
                      </Analysis>
                      <Analysis case={ variant("chr1:g.[10A>T];[10A>T]") }>
                      Homozygote-T
                      </Analysis>
                      <Analysis case={ variant("chr1:g.[10A>C];[10A>C]") }>
                      Homozygote-C
                      </Analysis>
                      <Analysis case={ variant("chr1:g.[10A>C];[10A>T]") }>
                      Compound Heterozygote
                      </Analysis>
                    </AnalysisBox>`,
          title: 'variant-test'
        });
        await addFixtures(report);
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
