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

/* istanbul ignore next */
export function makeHGVS(
  genomeVersion:string,
  chromosome:string,
  start:number,
  ref:string,
  altBases:string,
  zygosity:string) : string {
  var genome = HumanGenomeAccessions[genomeVersion];
  var accession = genome && genome[chromosome];
  var head = accession + ':g.';
  var wildType = ()=>`[${start}=]`;
  var substitution = (baseNumber:number)=>`[${start}${ref}>${altBases[baseNumber]}]`;
  if (!accession) {
    throw new Error(`Invalid genome version "${genomeVersion}" or chromosome "${chromosome}"`);
  }

  ref = ref ? ref.toUpperCase() : ref;
  altBases = altBases ? altBases.toUpperCase() : altBases;

  if (altBases.length===1) {
    switch (zygosity) {
      case 'wildtype':
        return head + wildType() + wildType();
      case 'heterozygous':
        return head + wildType() + substitution(0);
      case 'haploid':
        return head + substitution(0);
      default:
        throw new Error(`Unexpected zygosity "${zygosity}" when altBases is "${altBases}"`);
    }
  } else if (altBases.length===2) {
    return head + substitution(0) + substitution(1);
  } else if (altBases==='<NON_REF>' && zygosity==='haploid') {
    return head + wildType();
  } else {
    throw new Error(`Unexpected inputs to makeHGVS zygosity: ${zygosity}, altBases: ${altBases}`);
  }
}
