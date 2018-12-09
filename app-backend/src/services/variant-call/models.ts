/*
* Copyright (c) 2017-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import { ExecResult } from 'dynogels';
import * as Joi from 'joi';
import * as math from 'mathjs';
import { ensureProps } from 'src/common/type-tools';
import {defineModel, ListenerNextFunction, ModelInstance} from 'src/db/dynamo/dynogels';
import {
  JoiStart, JoiRefVersion, JoiRefName, JoiNCBIAccession, refToNCBIAccession, VariantIndex
} from 'src/common/variant-tools';

export class VariantCallAttributes {
  userId?: string;
  variantId?: string; // unique value determined from other parameters
                      // see computeAttributes

  // 23andme, etc:
  sampleSource?: string;
  // file hash or sample identifier
  sampleId?: string;

  // VCF genome version number, if provided
  refVersion?: string;
  // sequence name e.g., chr1
  refName?: string;

  // start index with respect to sequence - must be string for DynamoDB indexing
  start?: number;
  
  // changes described in this variant call e.g., [ "T", "C" ] or [ "<NO_REF>" ]
  altBases?: string[];
  // sequence being replaced e.g., "A"
  refBases?: string;
  // array of (usually 2) numbers representing refBase (if 0) or an altBase (if >=1) for each chromosome
  genotype?: number[];
  // Probabilities corresponding to enumerated genotypes (see discussing of how VCF encodes this below)
  genotypeLikelihoods?: number[];
  // The extent to which the genotype is supported by imputation
  altBaseDosage?: number[];
  // directRead a non-imputed variant call was found for this location
  directRead?: string;
  // imputed an imputed variant call was found for this location
  imputed?: string;
  // is this seed data?
  seed?: boolean;

  //
  // Annotations
  //
  rsId?: string;
  gene?: string;
  geneStart?: number;
  geneEnd?: number;
  zygosity?: keyof typeof Zygosity;
}

interface VariantCallMethods {
  genotypeBases(): string[];
  isValid(): boolean;
}

class VariantCallStaticMethods {
  async forUser(
    userId: string,
    variantIndexes: VariantIndex[]
  ): Promise<VariantCall[]> {
    const queries: Promise<ExecResult<any>>[] = []; // tslint:disable-line no-any
    variantIndexes.forEach((index: VariantIndex) => {
      const partialId = makePartialVariantId(index);
      queries.push(VariantCall.query(userId)
        .consistentRead(true)
        .where('variantId')
        .beginsWith(partialId)
        .execAsync());
    });

    const execResults = await Promise.all(queries);
    return <VariantCall[]> (execResults.map( 
      er => (er && er.Count) ? <VariantCall> er.Items[0] : null
    ).filter(x => !!x));
  }
}

// model instance type
export type VariantCall = ModelInstance<VariantCallAttributes, VariantCallMethods>;

export enum Zygosity {
  heterozygous = 'heterozygous',
  homozygous = 'homozygous', 
  wildtype = 'wildtype', 
  haploid = 'haploid'
}

const genotypeLikelihoods = () => {
  return Joi.array().items(Joi.number());
};

const failOrUndefined = Joi.alternatives().try(
  Joi.string().uppercase().only('FAIL'), 
  Joi.forbidden() // think of this as an alias for .isUndefined()
);
  
const ifValidCall = ( 
  validReadSchema: Joi.AnySchema, 
  invalidReadSchema: Joi.AnySchema, 
  defaultValue: any // tslint:disable-line
) => {
  return Joi.alternatives().when('directRead', {
    is: failOrUndefined,
    then: Joi.alternatives().when('imputed', {
      is: failOrUndefined, 
      then: invalidReadSchema,
      otherwise: validReadSchema
    }),
    otherwise: validReadSchema
  })
  .default(defaultValue);
};

const ifImputed = (
  validReadSchema: Joi.AnySchema, 
  invalidReadSchema: Joi.AnySchema, 
  defaultValue: any // tslint:disable-line
) => Joi.any().when('imputed', {
  is: failOrUndefined,
  then: invalidReadSchema,
  otherwise: validReadSchema
})
.default(defaultValue);

export const VariantCall = defineModel<
  VariantCallAttributes, VariantCallMethods, VariantCallStaticMethods
>(
  'variant-call', {
    hashKey : 'userId',
    rangeKey: 'variantId',

    timestamps : true,

    schema : {
      userId: Joi.string(),

      variantId: Joi.string().required(),

      //
      // Core VCF data
      //
      // NCBI accession
      accession: JoiNCBIAccession,
      // sequence name e.g., chr1...chr22, chrX, chrY, MT
      refName: JoiRefName,
      // the genome version - only GRCh37 for now
      refVersion: JoiRefVersion,
      
      // 23andme, ancestry, etc
      sampleSource: Joi.string().allow('23andme'),
      // unique identifier of the measurement (e.g., 23andme file hash, akesogen id)
      sampleId: Joi.string().required(),

      // start index with respect to sequence - must be string for DynamoDB indexing
      start: JoiStart.required(),
      
      // changes described in this variant call e.g., [ "T", "C" ] or [ "<NO_REF>" ]
      altBases: Joi.array().items(Joi.string().uppercase().regex(/([ATGC]*)|<NON_REF>/, 'altbases pattern')).min(1),
      // sequence being replaced e.g., "A"
      refBases: Joi.string().uppercase().regex(/\.|[ATGC]*/, 'reference bases pattern'),
      
      // array of 1-based indexes into alternateBases 
      // (for diploid chromosomes, there are two values, each representing a
      // call for one of the chromosomes
      genotype: ifValidCall(
        Joi.array().items(Joi.number()).min(1), 
        Joi.array().items(Joi.number()),
        []
      ),
      
      // Array of floats representing probabilities corresponding to 
      // genotypes, where the genotypes are enumerated as defined in the VCF spec:
      // "the ordering of genotypes for the likelihoods is given by:
      //  F(j/k) = (k*(k+1)/2)+j. In other words, for biallelic sites 
      //  the ordering is: AA,AB,BB; for triallelic sites the
      //  ordering is: AA,AB,BB,AC,BC,CC, etc."
      //  Where AA = genotype [0,0], AB = genotype [0,1] etc
      // NOTE: this function produces ambiguous orderings unless genotype order is normalized
      //       so values are in ascending order:
      // F(0,0) = 0
      // F(0,1) = F(1,0) = 1 (good)
      // F(1,1) = 2
      // F(0,2) = 3 !== F(2,0) (bad! F(2,0)=2)
      // F(1,2) = 4
      // F(2,2) = 5
      genotypeLikelihoods: ifValidCall(
        genotypeLikelihoods().required(), 
        Joi.optional(),
        undefined
      ),
      
      // The dosage of the altBase detected, a floating point value from 0 to 2 where
      //    0 = most certain "wt" call
      //    1 = most certain "het" call
      //    2 = most certain "hom" call 
      altBaseDosage: ifImputed(
        Joi.array().min(1).items(Joi.number().min(0).max(2)).required(),
        Joi.array().items(Joi.number().min(0).max(2)).optional(),
        undefined),

      directRead: Joi.string().uppercase().allow('PASS', 'FAIL')
        .optional().description('if PASS this was successfully read'),

      imputed: Joi.string().uppercase().valid('PASS', 'FAIL')
                .optional().description('if PASS this was successfully imputed'),
    
      // is this seed data?
      seed: Joi.boolean().description('if true, this entry represents seed data'),

      //
      // Annotations
      //
      rsId: Joi.string().optional().regex(/rs\d+/),
      gene: Joi.string().optional(),
      geneStart: Joi.number().optional(), // genomic coordinate for start base
      geneEnd: Joi.number().optional(),   // genomic coordinate for end base
      zygosity: Joi.string().valid(...(<any> Object).values(Zygosity)).optional(), // tslint:disable-line no-any

      //
      // Index support
      //
      grch37Start: Joi.string().regex(/[\w\d]+:.*/) // chr{n}:{1-based-genomic-index}
    },
    indexes: [
      {
        name: 'userGRCh37StartIndex',
        type: 'local',
        hashKey: 'userId',
        rangeKey: 'grch37Start'
      },
      {
        name: 'userRSIdIndex',
        type: 'local',
        hashKey: 'userId',
        rangeKey: 'rsId'
      }
    ]
  },
  VariantCallStaticMethods
);

//
// Instance methods
//
VariantCall.prototype.genotypeBases = function genotypeBases() {
  const _this = <VariantCall> this;
  return _this.getValid('genotype').map(index => {
    if (index === 0) {
      return this.getValid('refBases');
    } else {
      const altBases = this.getValid('altBases');
      if (index > altBases.length) {
        const id = `${this.get('userId')} ${this.get('variantId')}`;
        throw new Error(`Invalid VariantCall ${id} no altBase for genotype index ${index}`);
      }
      return altBases[index - 1];
    }
  });
};

VariantCall.prototype.isValid = function isValid() {
  const _this = <VariantCall> this;
  return isValidCall(_this.get());
};

//
// Hooks
//
VariantCall.before('create', computeAttributes);
VariantCall.before('update', computeAttributes);

//
// Helper functions
//
/**
 * Computes / updates dependent attributes
 * @param variantCall
 * @param next
 */
function computeAttributes(variantCall: VariantCallAttributes, next: ListenerNextFunction) {
  try {
    const {refName, refVersion, start, sampleSource, sampleId, altBases } = ensureProps(
      variantCall, 'start', 'sampleSource', 'sampleId', 'refName', 
      'refBases', 'refVersion', 'altBases', 'userId'
    );
    const accession = refToNCBIAccession(refName, refVersion);
    const variantId = makeVariantId(refName, refVersion, start, sampleSource, sampleId);
    if (isValidCall(variantCall)) {
      const { genotype, genotypeLikelihoods: likelihoods } = ensureProps(variantCall, 
        'genotype', 'genotypeLikelihoods');
      const zygosity = zygosityFromGenotype(genotype);
      checkGenotypeLikelihoods(likelihoods, genotype, altBases);
      next(null, {...variantCall, variantId, zygosity, accession });
    } else {
      next(null, {...variantCall, variantId, accession});
    }
    
  } catch (e) {
    const message = e instanceof Error ? e.message : e;
    const resultError = new Error(`Bad VariantCall attributes ${message}: ${JSON.stringify(variantCall)}`);
    if (e instanceof Error) {
      resultError.stack = e.stack;
    }
    next(resultError);
  }
}

export function checkGenotypeLikelihoods(gLikelihood?: number[], genotype?: number[], altBases?: string[]): void {
  if (genotype && altBases) {
    const expectedLength = combinationsWithRepeats(altBases.length + 1, genotype.length);
    if (!gLikelihood || expectedLength !== gLikelihood.length) {
      throw new Error(`Invalid genotype likelihood values: ${gLikelihood} expecting ${expectedLength} numbers`);
    }
  }
}

export function combinationsWithRepeats(alternatives: number, selections: number) {
  const result = math.divide(
    math.permutations(selections + alternatives - 1),
    math.multiply(math.permutations(alternatives - 1),  math.permutations(selections))
  );
  
  return result;
}

export function makeVariantId(
  refName: string, refVersion: string, start: number, sampleSource: string, sampleId: string
) {
  return `${refName}:${refVersion}:${start}:${sampleSource}:${sampleId}`;
}

export function makePartialVariantId({refVersion, refName, start}: VariantIndex) {
  return `${refName}:${refVersion}:${start}`;
}

export function zygosityFromGenotype(genotype?: number[]): Zygosity | undefined {
  if (!genotype) {
    throw new Error(`Unable to determine zygosity from genotype ${genotype}`);
  }

  genotype.sort();

  if (genotype === [0, 0]) {
    return Zygosity.wildtype;
  } else if (genotype.length === 1) {
    return Zygosity.haploid;
  } else if (genotype.every(g => g === genotype[0])) {
    return Zygosity.homozygous;
  } else {
    return Zygosity.heterozygous;
  }
}

export function isValidCall(vcAttrs: VariantCallAttributes): boolean {
  const valid = (x?: string) => x && /PASS/i.test(x);
  return !!(valid(vcAttrs.imputed) || valid(vcAttrs.directRead));
}
