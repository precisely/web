jest.mock('../../../../../features/genotype/models/Genotype');

import {getGenotypes} from '../../../../../features/genotype/services/Genotype';
import {log} from '../../../../../logger';
import {Genotype} from '../../../../../features/genotype/models/Genotype';

log.error = jest.fn();

describe('Genotype Service tests', function() {

  describe('getGenotypes test', function() {
    it('should log and throw error when it occurs', async function() {
      try {
        Genotype.query = jest.fn(() => { throw new Error('Genotype query mock error'); });
        await getGenotypes('invalid', ['demo', 'genes']);
      } catch (error) {
        expect(error).toHaveProperty('message', 'Genotype query mock error');
        expect(log.error).toBeCalledWith('genotypeResolver-list: Genotype query mock error');
      }
    });

    it('should return genotype list on success', async function() {
      // @ts-ignore
      Genotype.__resetGenotypeMock();
      const genotypes = await getGenotypes('valid', ['demo', 'genes']);
      expect(genotypes[0]).toHaveProperty('opaqueId', 'demo');
      expect(genotypes[0]).toHaveProperty('sampleId', 'demo');
    });
  });

});
