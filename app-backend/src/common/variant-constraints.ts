import * as Joi from 'joi';
import { isNumber, isString } from 'util';
export const RefNameRegex = /^(chr([1-9]|1\d|2[0-2]|X|Y)|MT)/;
export const AllowedRefVersion = 'GRCh37';
export const RSIdRegex = /rs\d+/i;
export const SVNAccessionRegex = /NC(\d+)\.(d+)/;

export const JoiRefVersion = Joi.string().default(AllowedRefVersion).allow(AllowedRefVersion);
export const JoiRefName = Joi.string().required().regex(RefNameRegex);
export const JoiStart = Joi.number().required().greater(0);
export const JoiRSId = Joi.string().regex(RSIdRegex);
export const JoiRefIndex = Joi.object({
  refName: JoiRefName,
  refVersion: JoiRefVersion,
  start: JoiStart
});

export function normalizeGenomeVersion(v: string | number | null | undefined | void) {
  if (!v || (isNumber(v) && v === 10) || (isString(v) && /hg19|GRCh37/i.test(v))) {
    return AllowedRefVersion;
  } else {
    throw new Error(`Invalid genome version ${v}`);
  }
}

function normalizeChromosomeName(chrom: string | number) {
  if (isNumber(chrom) && chrom > 0 && chrom < 25) {
    if (chrom < 23) {
      return `chr${chrom}`;
    } else if (chrom === 23) {
      return 'chrX';
    } else {
      return 'chrY';
    }
  } else if (isString(chrom) && RefNameRegex.test(chrom)) {
    return chrom;
  }

  throw new Error(`Invalid chromosome number ${chrom}`);
}

/**
 * Given NC00001 or NC00002.12 or chr1 or chrY or MT etc, returns the normalized
 * refName (chromosome name) and refVersion (genome version)
 * @param acc 
 * @returns [refName, refVersion] 
 */
export function normalizeReferenceName(acc: string): [string, string] {
  const svnAccessionMatch = SVNAccessionRegex.exec(acc);
  if (svnAccessionMatch) {
    // see https://varnomen.hgvs.org/bg-material/refseq/
    return [
      normalizeChromosomeName(svnAccessionMatch[1]),
      normalizeGenomeVersion(svnAccessionMatch[2])
    ];    
  } else if (normalizeChromosomeName(acc)) {
    return [acc, AllowedRefVersion];
  }
  throw new Error(`Invalid variant reference name ${acc}`);
}