import gql from 'graphql-tag';

export default [gql`
type VariantCall {
  userId: String,
  variantId: String,

  sampleType: String,
  sampleId: String,
  
  refName: String,
  refVersion: String,
  
  start: Int,
  end: Int,
  
  altBases: [String],
  refBases: String,
  
  genotype: [Int],
  genotypeLikelihood: [Int],
  filter: [String],

  rsId: String,
  gene: String,
  geneStart: Int,
  geneEnd: Int,
  zygosity: String,

  createdAt: String,
  updatedAt: String
}`];
