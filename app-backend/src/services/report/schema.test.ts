// tslint:disable no-any
/*
* Copyright (c) 2017-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/
// tslint:disable no-any
import { graphql, GraphQLSchema } from 'graphql';
import {
  makeExecutableSchema,
  addMockFunctionsToSchema
} from 'graphql-tools';
const cases = require('jest-in-case');
import { Report } from './models';

import typeDefs from 'src/services/schema';
    
// mocked schema tests according to https://www.apollographql.com/docs/graphql-tools/mocking.html
describe('Report schema', function () {
  
  let mockSchema: GraphQLSchema;
  
  beforeEach(() => {
    mockSchema = makeExecutableSchema({ typeDefs });
  
    // Here we specify the return payloads of mocked types
    addMockFunctionsToSchema({
      schema: mockSchema,
      mocks: {
        Int: () => 1,
        Float: () => 2.2,
        String: () => 'str',
        Report: () => new Report({}),
        JSON: () => [{type: 'JSON'}]
      }
    });
  });

  cases('should allow querying for reports', async (query: string) => {
    const result = await graphql(mockSchema, query, null, {}, {});
    expect(result).toEqual({
      data: {
        reports: [
          { id: 'str', ownerId: 'str', title: 'str', content: 'str', personalization: [{type: 'JSON'}]},
          { id: 'str', ownerId: 'str', title: 'str', content: 'str', personalization: [{type: 'JSON'}]}
        ]
      }
    });
  }, [`
    query {
      reports {
        id ownerId content personalization title
      }
    }`, `
    query {
      reports(state: draft) {
        id ownerId content personalization title
      }
    }
    `, `
    query {
      reports(state: published) {
        id ownerId content personalization title
      }
    }
    `, `
    query {
      reports(state: pending) {
        id ownerId content personalization title
      }
    }
    `, `
    query {
      reports(ownerId: "123123") {
        id ownerId content personalization title
      }
    }`, `
    query {
      reports(ownerId: "123123", state: pending) {
        id ownerId content personalization title
      }
    }`
  ]);

  cases('should query for a report by slug', async (query: string) => {
    const result = await graphql(mockSchema, query, null, {}, {});
    expect(result).toEqual({
      data: {
        report: { id: 'str', ownerId: 'str', title: 'str', content: 'str', personalization: [{type: 'JSON'}]}
      }
    });
  }, [`
    query {
      report(slug: "some-slug") {
        id ownerId content personalization title
      }
    }
  `, `
    query {
      report(id: "report-id") {
        id ownerId content personalization title
      }
    }
  `    
  ]);
});
