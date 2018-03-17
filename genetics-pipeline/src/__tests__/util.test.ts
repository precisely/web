import { makeHGVS } from "../utils";

describe('makeHGVS', function () {
  it('should return a wildtype homozygote', function () {
    expect(makeHGVS('GRCh37', '1', 111, 'A', 'T', 'wildtype')).toEqual('NC_000001.10:g.[111=][111=]');
  });

  it('should return a heterozygote', function () {
    expect(makeHGVS('GRCh37', '1', 111, 'A','T', 'heterozygous')).toEqual('NC_000001.10:g.[111=][111A>T]');
  });

  it('should return a homozygote', function () {
    expect(makeHGVS('GRCh37', '1', 111, 'A','TT', 'homozygous')).toEqual('NC_000001.10:g.[111A>T][111A>T]');
  });

  it('should return a haploid wildtype', function () {
    expect(makeHGVS('GRCh37', '1', 111, 'A','<NON_REF>', 'haploid')).toEqual('NC_000001.10:g.[111=]');
  });

  it('should return a haploid mutant', function () {
    console.log(makeHGVS('GRCh37', '1', 111, 'A','T', 'haploid'));
    expect(makeHGVS('GRCh37', '1', 111, 'A','T', 'haploid')).toEqual('NC_000001.10:g.[111A>T]');
  });

  it('should throw an error if an invalid reference genome is provided', function () {
    expect(()=>makeHGVS('WrongGenome', '1', 111, 'A','T', 'heterozygous')).toThrowError();
  });

  it('should throw an error if an invalid zygosity is given', function () {
    expect(()=>makeHGVS('GRCh37', '1', 111, 'A','T', 'WrOnGzyGoSiTY')).toThrowError();
  });

  it('should throw an error if there are >2 altBases', function () {
    expect(()=>makeHGVS('GRCh37', '1', 111, 'A','TGA', 'heterozygous')).toThrowError();
    expect(()=>makeHGVS('GRCh37', '1', 111, 'A','TGA', 'haploid')).toThrowError();
    expect(()=>makeHGVS('GRCh37', '1', 111, 'A','TGA', 'wildtype')).toThrowError();
  });
});