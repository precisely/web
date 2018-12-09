// tslint:disable no-any

import { VariantCall } from './models';
import { resolvers } from './resolvers';
import { IFieldResolver } from 'graphql-tools';
import { GraphQLContext } from 'src/services/graphql/graphql-context';
import { makeContext } from 'src/services/graphql/test-helpers';

const cases = require('jest-in-case');

describe('VariantCall resolver', function () {
  let vc: VariantCall;
  let context: GraphQLContext;

  beforeAll(() => {
    vc = new VariantCall({
      userId: 'auth0-user123',
      sampleSource: 'sample-source',
      refName: 'ref-name',
      refVersion: 'ref-version',
      sampleId: 'sample-id',
      start: 10,
      refBases: 'A',
      altBases: ['T'],
      altBaseDosages: [1],
      genotype: [0, 1],
      genotypeLikelihoods: [0, 1, 0],
      rsId: 'rs-id',
      gene: 'gene',
      geneStart: 10,
      geneEnd: 100,
      zygosity: 'heterozygous',
      imputed: 'PASS',
      directRead: 'PASS'
    });
    context =  makeContext({ userId: 'auth0-user123', roles: ['user']});
  });

  cases('should provide direct access to various fields', async function ([field, value]: [string, any]) {
    const resolver = <IFieldResolver<VariantCall, GraphQLContext>> resolvers.VariantCall[field]; 
    const result = await resolver(vc, {}, context, <any> {});
    // console.log('resolver(%j) = %j --- expecting %j', field, result, value);
    expect(result).toEqual(value);
  }, [
    [ 'sampleSource', 'sample-source'],
    [ 'refName', 'ref-name'],
    [ 'refVersion',  'ref-version'],
    [ 'sampleId', 'sample-id'],
    [ 'start', 10],
    [ 'refBases', 'A'],
    [ 'altBases', ['T']],
    [ 'genotype', [0, 1]],
    [ 'genotypeLikelihoods', [0, 1, 0]],
    [ 'rsId', 'rs-id'],
    [ 'gene', 'gene'],
    [ 'geneStart', 10],
    [ 'geneEnd', 100],
    [ 'zygosity', 'heterozygous'],
    [ 'imputed', 'PASS'],
    [ 'directRead', 'PASS'],
    [ 'altBaseDosages', [1]]
  ]);
});
