export  const mockCognitoUser = {
  firstName: 'demo-firstName',
  lastName: 'demo-lastName',
  email: 'demo-email@demo-precisely.com',
  password: 'demo-password',
  roles: 'demo-roles'
};

export const mockReportData = {
  id: 'dummy-id',
  title: 'dummy-title',
  slug: 'dummy-slug',
  rawContent: 'dummy-rawContent',
  parsedContent: 'dummy-parsedContent',
  topLevel: false,
  genes: ['dummy-genes']
};

export const mockGenotypeData = {
  opaqueId: 'dummy-opaqueId',
  sampleId: 'dummy-sampleId',
  source: 'dummy-source',
  gene: 'dummy-gene',
  variantCall: 'dummy-variantCall',
  zygosity: 'dummy-zygosity',
  startBase: 'dummy-startBase',
  chromosomeName: 'dummy-chromosomeName',
  variantType: 'dummy-variantType',
  quality: 'dummy-quality'
};

export const mockUserDataMap = {
  user_id: 'dummyId',
  opaque_id: 'a72078c2-83c3-465d-9526-d80622dd01b3',
  vendor_data_type: 'precisely:genotype'
};
