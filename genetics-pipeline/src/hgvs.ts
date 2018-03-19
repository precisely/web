const HumanGenomeAccessions = {
  'GRCh37': {
      '1':  'NC_000001.10',
      '2':  'NC_000002.11',
      '3':  'NC_000003.11',
      '4':  'NC_000004.11',
      '5':  'NC_000005.9',
      '6':  'NC_000006.11',
      '7':  'NC_000007.13',
      '8':  'NC_000008.10',
      '9':  'NC_000009.11',
      '10': 'NC_000010.10',
      '11': 'NC_000011.9',
      '12': 'NC_000012.11',
      '13': 'NC_000013.10',
      '14': 'NC_000014.8',
      '15': 'NC_000015.9',
      '16': 'NC_000016.9',
      '17': 'NC_000017.10',
      '18': 'NC_000018.9',
      '19': 'NC_000019.9',
      '20': 'NC_000020.10',
      '21': 'NC_000021.8',
      '22': 'NC_000022.10',
      'X':  'NC_000023.10',
      'Y':  'NC_000024.9',
      'MT': 'NC_012920.1'
  }
};

type HGVSArguments = {
  genomeVersion: string,
  chromosome: string,
  start: number,
  ref: string,
  altBases: string,
  zygosity: string
};

function accession(input: HGVSArguments): string {
  var genome = HumanGenomeAccessions[input.genomeVersion];
  var result = genome && genome[input.chromosome];
  if (!result) {
    throw new Error(`Invalid genome version "${input.genomeVersion}" or chromosome "${input.chromosome}"`);
  }
  return result;
}

function head(input: HGVSArguments): string {
  return accession(input) + ':g.';
}

function wildType(input: HGVSArguments): string {
  return `[${input.start}=]`;
}

function substitution(input: HGVSArguments, altBaseIndex: number): string {
  return `[${input.start}${input.ref.toUpperCase()}>${input.altBases[altBaseIndex].toUpperCase()}]`;
}

function hgvsSingleSubstitution(input: HGVSArguments): string {
  switch (input.zygosity) {
    case 'wildtype':
      return head(input) + wildType(input) + wildType(input);
    case 'heterozygous':
      return head(input) + wildType(input) + substitution(input, 0);
    case 'haploid':
      return head(input) + substitution(input, 0);
    default:
      throw new Error(`Unexpected zygosity "${input.zygosity}" when altBases is "${input.altBases}"`);
  }
}

export function makeHGVS(input: HGVSArguments): string {
  if (input.altBases.length === 1) {
    return hgvsSingleSubstitution(input);
  } else if (input.altBases.length === 2) {
    return head(input) + substitution(input, 0) + substitution(input, 1);
  } else if (input.altBases === '<NON_REF>' && input.zygosity === 'haploid') {
    return head(input) + wildType(input);
  } else {
    throw new Error(`Unexpected inputs to makeHGVS zygosity: ${input.zygosity}, altBases: ${input.altBases}`);
  }
}
