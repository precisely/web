jest.mock('../../../../../features/genotype/models/Genotype');

import '../__mocks__/Genotype.mock';
import {getGenotypes} from '../../../../../features/genotype/services/Genotype';
import {log} from '../../../../../logger';

log.error = jest.fn();

describe('Genotype Service tests', function() {

  describe('getGenotypes test', function() {
    it('should log and throw error when it occurs', async function() {
      try {
        await getGenotypes('invalid', ['demo', 'genes']);
      } catch (error) {
        expect(error).toHaveProperty('message', 'Genotype mock error');
        expect(log.error).toBeCalledWith('genotypeResolver-list: Genotype mock error');
      }
    });

    it('should return genotype list on success', async function() {
      const genotypes = await getGenotypes('valid', ['demo', 'genes']);
      expect(genotypes[0]).toHaveProperty('opaqueId', 'demo');
      expect(genotypes[0]).toHaveProperty('sampleId', 'demo');
    });
  });

});
