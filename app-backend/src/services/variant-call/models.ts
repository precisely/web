/*
* Copyright (c) 2017-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import { ExecResult } from 'dynogels';
import * as Joi from 'joi';

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
  // array of 1-based indexes into alternateBases
  genotype?: number[];
  // Phred scale likelihood corresponding to genotypes 0/0, 0/1, and 1/1
  genotypeLikelihood?: number;
  // Filter
  filter?: string;
  // Imputed
  imputed?: boolean;
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

class VariantCallMethods {
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

export const VariantFilter = [ 'IMP', 'FAIL', 'BOOST' ];
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
      genotype: Joi.array().items(Joi.number()),
      // Phred scale likelihood corresponding to genotypes 0/0, 0/1, and 1/1
      genotypeLikelihood: Joi.array().items(Joi.number()).length(3).optional(),
      
      // Filter
      filter: Joi.string().uppercase().optional(),
      
      // Was the reading imputed?
      imputed: Joi.boolean().default(false),

      // is this seed data?
      seed: Joi.boolean().description('represents seed data'),

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

/**
 * Computes / updates dependent attributes
 * @param variantCall
 * @param next
 */
function computeAttributes(variantCall: VariantCallAttributes, next: ListenerNextFunction) {
  try {
    const {refName, refVersion, start, sampleSource, sampleId, altBases, imputed, readFail } = ensureProps(
      variantCall, 'start', 'sampleSource', 'sampleId', 'refName', 
      'refBases', 'refVersion', 'altBases', 'readFail', 'userId', 'imputed', 'readFail'
    );
    const accession = refToNCBIAccession(refName, refVersion);
    const variantId = makeVariantId(refName, refVersion, start, sampleSource, sampleId);
    
    const variantId = makeVariantId(refName, refVersion, start, end, sampleSource, sampleId);
    const zygosity = zygosityFromGenotype(genotype);
    next(null, {...variantCall, end, variantId, zygosity, accession });
  } catch (e) {
    next(e);
  }
}

function lengthFromGenotypeIndex(refBases: string, altBases: string[], index: number): number {
  const bases = basesFromGenotypeIndex(refBases, altBases, index);
  return bases === '.' ? 0 : bases.length;
}

function basesFromGenotypeIndex(refBases: string, altBases: string[], index: number): string {
  return index === 0 ? refBases : altBases[index - 1];
}

export function makeVariantId(
  refName: string, refVersion: string, start: number, sampleSource: string, sampleId: string
) {
  return `${refName}:${refVersion}:${start}:${sampleSource}:${sampleId}`;
}

export function makePartialVariantId({refVersion, refName, start}: VariantIndex) {
  return `${refName}:${refVersion}:${start}`;
}

function zygosityFromGenotype(genotype?: number[]): Zygosity | undefined {
  if (!genotype) {
    return;
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

VariantCall.before('create', computeAttributes);
VariantCall.before('update', computeAttributes);

//
// STATIC METHOD DEFINITIONS
//
// VariantCall.forUser = async function forUser(
//   userId: string,
//   { refIndexes, rsIds }: VariantCallIndexes
// ): Promise<VariantCall[]> {
  
//   const queries: Promise<ExecResult<any>>[] = []; // tslint:disable-line no-any
//   if (refIndexes) {
//     refIndexes.forEach((index: RefIndex) => {
//       const { refName, refVersion, start} = index;
//       if (refName && refVersion && start) {
//         const variantIdStart = `${refName}:${refVersion}:${start}`;
//         queries.push(VariantCall.query(userId).where('variantId').beginsWith(variantIdStart).execAsync());
//       } else {
//         throw new Error(`Invalid index for Variant: ${index}`);
//       }
//     });
//   }
//   if (rsIds) {
//     rsIds.forEach(rsId => {
//       queries.push(VariantCall.query(userId).usingIndex('userRSIdIndex').where('rsId').equals(rsId).execAsync());
//     });
//   }

//   const execResults = await Promise.all(queries);
//   return <VariantCall[]> (execResults.map( 
//     er => (er && er.Count) ? <VariantCall> er.Items[0] : null
//   ).filter(x => !!x));
// };

//
// INSTANCE METHOD DEFINITIONS
//
// VariantCall.prototype.foo = function foo() {}
