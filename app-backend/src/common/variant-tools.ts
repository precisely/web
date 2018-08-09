import * as Joi from 'joi';
import { isNumber, isString } from 'util';
import { invert, padStart } from 'lodash';

export const RefNameRegex = /^(chr([1-9]|1\d|2[0-2]|X|Y)|MT)/;
export const AllowedRefVersion = '37p13';
export const RSIdRegex = /rs\d+/i;
export const NCBIAccessionRegex = /NC_0000(?:0[1-9]|1[0-9]|2[0-4])\.(\d+)/;
export const PermissiveNCBIAccessionRegex = /NC_?(\d+)\.(\d+)/i;
export const JoiRefVersion = Joi.string().allow(AllowedRefVersion);
export const JoiRefName = Joi.string().regex(RefNameRegex).description('expecting chr1-chr22|chrX|chrY|MT');
export const JoiStart = Joi.number().required().greater(0);
export const JoiRSId = Joi.string().regex(RSIdRegex);
export const JoiNCBIAccession = Joi.string().regex(NCBIAccessionRegex)
                                  .description('NC_0000dd.dd format');
export const JoiVariantIndex = Joi.object({
  refName: JoiRefName,
  refVersion: JoiRefVersion,
  start: JoiStart,
  end: Joi.number().optional().greater(Joi.ref('start'))
});

// structure used to index variants throughout the system
export type VariantIndex = { refName: string, refVersion: string, start: number };

const VCFRefToAccession = {
  'chr1.37p13':   'NC_000001.10',   // https://www.ncbi.nlm.nih.gov/nuccore/NC_000001?report=girevhist
  'chr2.37p13':   'NC_000002.11',   // https://www.ncbi.nlm.nih.gov/nuccore/NC_000002?report=girevhist
  'chr3.37p13':   'NC_000003.11',   // https://www.ncbi.nlm.nih.gov/nuccore/NC_000003?report=girevhist
  'chr4.37p13':   'NC_000004.11',   // https://www.ncbi.nlm.nih.gov/nuccore/NC_000004?report=girevhist
  'chr5.37p13':   'NC_000005.9',    // https://www.ncbi.nlm.nih.gov/nuccore/NC_000005?report=girevhist
  'chr6.37p13':   'NC_000006.11',   // https://www.ncbi.nlm.nih.gov/nuccore/NC_000006?report=girevhist
  'chr7.37p13':   'NC_000007.13',   // https://www.ncbi.nlm.nih.gov/nuccore/NC_000007?report=girevhist
  'chr8.37p13':   'NC_000008.10',   // https://www.ncbi.nlm.nih.gov/nuccore/NC_000008?report=girevhist
  'chr9.37p13':   'NC_000009.11',   // https://www.ncbi.nlm.nih.gov/nuccore/NC_000009?report=girevhist
  'chr10.37p13':  'NC_000010.10',   // https://www.ncbi.nlm.nih.gov/nuccore/NC_000010?report=girevhist
  'chr11.37p13':  'NC_000011.9',    // https://www.ncbi.nlm.nih.gov/nuccore/NC_000011?report=girevhist
  'chr12.37p13':  'NC_000012.11',   // https://www.ncbi.nlm.nih.gov/nuccore/NC_000012?report=girevhist
  'chr13.37p13':  'NC_000013.10',   // https://www.ncbi.nlm.nih.gov/nuccore/NC_000013?report=girevhist
  'chr14.37p13':  'NC_000014.8',    // https://www.ncbi.nlm.nih.gov/nuccore/NC_000014?report=girevhist
  'chr15.37p13':  'NC_000015.9',    // https://www.ncbi.nlm.nih.gov/nuccore/NC_000015?report=girevhist
  'chr16.37p13':  'NC_000016.9',    // https://www.ncbi.nlm.nih.gov/nuccore/NC_000016?report=girevhist
  'chr17.37p13':  'NC_000017.10',   // https://www.ncbi.nlm.nih.gov/nuccore/NC_000017?report=girevhist  
  'chr18.37p13':  'NC_000018.9',    // https://www.ncbi.nlm.nih.gov/nuccore/NC_000018?report=girevhist
  'chr19.37p13':  'NC_000019.9',    // https://www.ncbi.nlm.nih.gov/nuccore/NC_000019?report=girevhist
  'chr20.37p13':  'NC_000020.10',   // https://www.ncbi.nlm.nih.gov/nuccore/NC_000020?report=girevhist
  'chr21.37p13':  'NC_000021.8',    // https://www.ncbi.nlm.nih.gov/nuccore/NC_000021?report=girevhist
  'chr22.37p13':  'NC_000022.10',   // https://www.ncbi.nlm.nih.gov/nuccore/NC_000022?report=girevhist
  'chrX.37p13':   'NC_000023.10',   // https://www.ncbi.nlm.nih.gov/nuccore/NC_000023?report=girevhist
  'chrY.37p13':   'NC_000024.9',    // https://www.ncbi.nlm.nih.gov/nuccore/NC_000024?report=girevhist
  'MT.37p13':     'NC_012920.1'     // https://www.ncbi.nlm.nih.gov/nuccore/251831106?sat=4&satkey=126362517
};

const AccessionToVCFRef =  invert(VCFRefToAccession);

export function refToNCBIAccession(refName: string, refVersion: string) {
  const vcfRef = `${refName}.${normalizeGenomeVersion(refVersion)}`;
  
  const result = VCFRefToAccession[vcfRef];
  if (!result) {
    throw new Error(`Unrecognized refName:refVersion pair ${vcfRef}`);
  }
  return result;
}

export function normalizeNCBIAccession(acc: string) {
  const match = PermissiveNCBIAccessionRegex.exec(acc);
  if (match) {
    const seqId = padStart(match[1], 6, '0');
    const version = `${parseInt(match[2], 10)}`;
  
    const result = `NC_${seqId}.${version}`;
    return result;
  } 
  throw new Error(`Invalid accession: ${acc}`);
}

export function ncbiAccessionToRef(acc: string): string {
  const result = AccessionToVCFRef[normalizeNCBIAccession(acc)];
  if (!result) {
    throw new Error(`Unrecognized accession: ${acc}`);
  }
  return result;
}

const AllowedRefVersionRegex = new RegExp(AllowedRefVersion, 'i');
function isValidGenomeVersionString(v: string): v is string {
  return  AllowedRefVersionRegex.test(v);
}

export function normalizeGenomeVersion(v: string) {
  const match = /(?:GRCh)?(\d+)p(\d+)/i.exec(v);
  if (match) {
    return `${match[1]}p${match[2]}`;
  }
  throw new Error(`Invalid genome version ${v}`);
}

function isValidHumanChromosomeNumber(chrom: string | number): chrom is number {
  return isNumber(chrom) && chrom > 0 && chrom < 25;
}

function normalizeChromosomeName(chrom: string | number): string {
  if (isValidHumanChromosomeNumber(chrom)) {
    if (chrom < 23) {
      return `chr${chrom}`;
    } else if (chrom === 23) {
      return 'chrX';
    } else {
      return 'chrY';
    }
  } else if (isString(chrom)) {
    if (RefNameRegex.test(chrom)) {
      return chrom;
    } else {
      const chromNum = parseInt(chrom, 10);
      if (chromNum !== NaN) {
        return normalizeChromosomeName(chromNum);
      }
    }
  }

  throw new Error(`Invalid chromosome value ${chrom}`);
}

/**
 * Given NC_00001 or NC_00002.12 or chr1 or chrY or MT etc, returns the normalized
 * refName (chromosome name) and refVersion (genome version)
 * @param acc 
 * @returns [refName, refVersion] 
 */
export function normalizeReferenceName(acc: string): [string, string] {
  const accessionMatch = PermissiveNCBIAccessionRegex.exec(acc);
  if (accessionMatch) {
    // see https://varnomen.hgvs.org/bg-material/refseq/
    const [ref, ver] = ncbiAccessionToRef(acc).split('.');
    return [ref, ver];
  } else {
    const [rawRef, rawVer] = acc.split('.');
    const ref = normalizeChromosomeName(rawRef);
    const ver = normalizeGenomeVersion(rawVer);

    if (VCFRefToAccession[`${ref}.${ver}`]) {
      return [ref, ver];
    }
  }
  throw new Error(`Invalid variant reference name ${acc}`);
}
