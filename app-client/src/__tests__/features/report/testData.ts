/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import {ReportData} from 'src/features/report/interfaces';

export const dummyData: {report: ReportData} = {
  report: {
    slug: 'dolorem-error-minima',
    id: 'cb1f87a2-f201-44f7-8cc6-4fbf4c859d8c',
    title: 'Accusamus vitae quo excepturi voluptas esse.',
    genes: [
      'MTHFR'
    ],
    rawContent: '--', // tslint:disable-next-line
    parsedContent: "[{\"type\":\"tag\",\"name\":\"usergenotypeswitch\",\"children\":[{\"type\":\"tag\",\"name\":\"genotypecase\",\"children\":[{\"type\":\"text\",\"blocks\":[\"<p>Et esse debitis minus et saepe.</p>\"]}],\"rawName\":\"GenotypeCase\",\"attrs\":{\"svn\":\"NC_000001.11:g.[11796322C>T];[11796322C>T]\"},\"selfClosing\":false},{\"type\":\"tag\",\"name\":\"genotypecase\",\"children\":[{\"type\":\"text\",\"blocks\":[\"<p>This is a fallback text.</p>\"]}],\"rawName\":\"GenotypeCase\",\"attrs\":{},\"selfClosing\":false}],\"rawName\":\"UserGenotypeSwitch\",\"attrs\":{\"gene\":\"MTHFR\"},\"selfClosing\":false}]",
    userData: {
      genotypes: [
        {
          opaqueId: '2550d9a7-a04f-4246-a171-00f4e6b4b0d6',
          quality: '--',
          gene: 'MTHFR',
          zygosity: '--',
          variantCall: 'NC_000001.11:g.[11796322C>T];[11796322C>T]',
        }
      ],
    },
  }
};

export const parsedContentJson = {
  type: 'tag',
  name: 'usergenotypeswitch',
  children: [
    {
      type: 'tag',
      name: 'genotypecase',
      children: [
        {
          type: 'text',
          blocks: [
            '<p>Et esse debitis minus et saepe.</p>'
          ]
        }
      ],
      rawName: 'GenotypeCase',
      attrs: {
        svn: 'NC_000001.11:g.[11796322C>T];[11796322C>T]'},
        selfClosing: false
    },
    {
      type: 'tag',
      name: 'genotypecase',
      children: [
        {
          type: 'text',
          blocks: [
            '<p>This is a fallback text.</p>'
          ]
        }
      ],
      rawName: 'GenotypeCase',
      attrs: {},
      selfClosing: false
      }
  ],
  rawName: 'UserGenotypeSwitch',
  attrs: {
    gene: 'MTHFR'
  },
  selfClosing: false
};
