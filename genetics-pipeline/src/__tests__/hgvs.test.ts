import { makeHGVS } from "../hgvs";

describe('makeHGVS', function () {
  it('should return a wildtype homozygote', function () {
    expect(makeHGVS({genomeVersion: 'GRCh37', chromosome: '1', start: 111, ref: 'A', altBases: 'T', zygosity: 'wildtype'})).toEqual('NC_000001.10:g.[111=][111=]');
  });

  it('should return a heterozygote', function () {
    expect(makeHGVS({genomeVersion: 'GRCh37', chromosome: '1', start: 111, ref: 'A', altBases:'T', zygosity: 'heterozygous'})).toEqual('NC_000001.10:g.[111=][111A>T]');
  });

  it('should return a homozygote', function () {
    expect(makeHGVS({genomeVersion: 'GRCh37', chromosome: '1', start: 111, ref: 'A', altBases:'TT', zygosity: 'homozygous'})).toEqual('NC_000001.10:g.[111A>T][111A>T]');
  });

  it('should return a haploid wildtype', function () {
    expect(makeHGVS({genomeVersion: 'GRCh37', chromosome: '1', start: 111, ref: 'A', altBases:'<NON_REF>', zygosity: 'haploid'})).toEqual('NC_000001.10:g.[111=]');
  });

  it('should return a haploid mutant', function () {
    expect(makeHGVS({genomeVersion: 'GRCh37', chromosome: '1', start: 111, ref: 'A', altBases:'T', zygosity: 'haploid'})).toEqual('NC_000001.10:g.[111A>T]');
  });

  it('should throw an error if an invalid reference genome is provided', function () {
    expect(()=>makeHGVS({genomeVersion: 'WrongGenome', chromosome: '1', start: 111, ref: 'A', altBases:'T', zygosity: 'heterozygous'})).toThrowError();
  });

  it('should throw an error if an invalid zygosity is given', function () {
    expect(()=>makeHGVS({genomeVersion: 'GRCh37', chromosome: '1', start: 111, ref: 'A', altBases:'T', zygosity: 'WrOnGzyGoSiTY'})).toThrowError();
  });

  it('should throw an error if there are >2 altBases', function () {
    expect(()=>makeHGVS({genomeVersion: 'GRCh37', chromosome: '1', start: 111, ref: 'A', altBases:'TGA', zygosity: 'heterozygous'})).toThrowError();
    expect(()=>makeHGVS({genomeVersion: 'GRCh37', chromosome: '1', start: 111, ref: 'A', altBases:'TGA', zygosity: 'haploid'})).toThrowError();
    expect(()=>makeHGVS({genomeVersion: 'GRCh37', chromosome: '1', start: 111, ref: 'A', altBases:'TGA', zygosity: 'wildtype'})).toThrowError();
  });
});