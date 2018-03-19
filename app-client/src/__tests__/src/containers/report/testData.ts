/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import {ReportList} from 'src/containers/report/interfaces';

export const dummyData: ReportList = {
  Items: [{
    attrs: {
      id: 'qwerty1234',
      title: 'A title',
      slug: 'demo',
      raw_content: 'I am the RAW content',
      parsed_content: 'And, I am the Parsed content.',
      top_level: true,
      genes: ['a', 'b'],
    }
  }],
  userData: {
    Items: [{
      attrs: {
        gene: 'demo',
        opaque_id: 'qwerty',
        sample_id: 'test',
        quality: 'good',
        variant_call: 'dummy'
      }
    }],
  },
};

export const dummyParsedContent: Array<Object> = [
  {
    'type': 'tag',
    'name': 'usergenotypeswitch',
    'children': [
      {
        'type': 'tag',
        'name': 'genotypecase',
        'children': [
          {
              'type': 'text',
              'blocks': [
                '<p>This is a dummy text.<\/p>'
              ]
          }
        ],
        'rawName': 'GenotypeCase',
        'attrs': {
          'svn': 'demo-variant_call-2'
        },
        'selfClosing': false
      },
      {
        'type': 'tag',
        'name': 'genotypecase',
        'children': [
          {
              'type': 'text',
              'blocks': [
                '<p>This is a fallback text.<\/p>'
              ]
          }
        ],
        'rawName': 'GenotypeCase',
        'attrs': {},
        'selfClosing': false
      }
    ],
    'rawName': 'UserGenotypeSwitch',
    'attrs': {
      'gene': 'demo-gene-2'
    },
    'selfClosing': false
  }
];
