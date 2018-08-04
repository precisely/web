import { VariantCallService } from './service';
import { destroyFixtures } from 'src/common/fixtures';

describe('VariantCallService', function () {
  
  afterEach(destroyFixtures);
  
  describe('addVariantCalls', function () {
    it('should create variants', async function () {
      const result = await VariantCallService.addVariantCalls([
        { refName: 'chr1',  start: 10, altBases: ['A', 'T'], refBases: 'C', callSetId: '23andme-b4ccfd7a87a', 
          userId: 'the-user-id', genotype: [0, 1] },
        { refName: 'chr2',  start: 20, altBases: ['G'], refBases: 'A', callSetId: '23andme-b4ccfd7a87a', 
          userId: 'the-user-id', genotype: [1, 1] },
      ]);
      expect(result).toMatchObject([
        { data: { refName: 'chr1', start: 10, zygosity: 'heterozygous', genotype: [0, 1], 
          altBases: ['A', 'T'], refBases: 'C', userId: 'the-user-id' }},
        { data: {  refName: 'chr2', start: 20, zygosity: 'homozygous', genotype: [1, 1],
          refBases: 'A', altBases: ['G'], userId: 'the-user-id'
       }}
      ]);
    });

    it('should return result reflecting some invalid inputs', async function () {
      const result = await VariantCallService.addVariantCalls([
        { refName: 'chr1',  start: 10, altBases: ['A', 'T'], refBases: 'C', callSetId: '23andme-b4ccfd7a87a', 
          userId: 'the-user-id', genotype: [0, 1] },
        { refName: 'chr2',  start: 20, altBases: ['G'], refBases: 'A', callSetId: '23andme-b4ccfd7a87a', 
          userId: 'the-user-id', genotype: [1, 1] },
        { refName: 'invalid-ref-name',  start: 20, altBases: ['G'], refBases: 'A', callSetId: '23andme-b4ccfd7a87a', 
          userId: 'the-user-id', genotype: [1, 1] }
      ]);
      expect(result).toMatchObject([
        { data: { refName: 'chr1', start: 10, zygosity: 'heterozygous', genotype: [0, 1], 
          altBases: ['A', 'T'], refBases: 'C', userId: 'the-user-id' }},
        { data: {  refName: 'chr2', start: 20, zygosity: 'homozygous', genotype: [1, 1],
          refBases: 'A', altBases: ['G'], userId: 'the-user-id' }},
        { data: { refName: 'invalid-ref-name',  start: 20, altBases: ['G'], refBases: 'A', 
                  callSetId: '23andme-b4ccfd7a87a', userId: 'the-user-id', genotype: [1, 1] },
          error: /^ValidationError.*/ }
      ]);
    });
  });
});
