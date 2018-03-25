import {Genotype} from '../../../../../features/genotype/models/Genotype';

Genotype.query = jest.fn()
  .mockImplementation(() => ({
    filter: jest.fn(() => ({
      in: jest.fn(() => ({
        execAsync: jest.fn(() => ({
          Items: [{
            get: () => ({
              opaqueId: 'demo',
              sampleId: 'demo',
            })
          }]
        }))
      }))
    }))
  }))
  .mockImplementationOnce(function() { throw new Error('Genotype mock error'); });
