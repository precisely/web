/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

export interface Genotype {
  opaqueId: string;
  sampleId: string;
  source: string;
  gene: string;
  variantCall: string;
  zygosity: string;
  startBase: string;
  chromosomeName: string;
  variantType: string;
  quality: string;
}

export interface UserData {
  genotypes: Genotype[];
}

export interface ReportData {
  id: string;
  title: string;
  slug: string;
  rawContent: string;
  parsedContent: string;
  topLevel: boolean;
  genes: string[];
  userData: UserData;
}
