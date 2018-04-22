// Type definitions for dynogels 8.0
// Project: https://github.com/clarkie/dynogels#readme
// Definitions by: Spartan Labs <https://github.com/SpartanLabs>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.4

declare module "dynogels" {
  export import AWS = require("aws-sdk");
  import * as joi from "joi";
  import stream = require("stream");

  // Dynogels Data Members
  export let log: Log;
  export let models: { [key: string]: Model };
  export let types: {
      stringSet(): joi.AnySchema;
      numberSet(): joi.AnySchema;
      binarySet(): joi.AnySchema;
      uuid(): joi.AnySchema;
      timeUUID(): joi.AnySchema;
  };

  export interface Log {
      info(...args: any[]): void;
      warn(...args: any[]): void;
  }

  // Dynogels global functions
  export function dynamoDriver(dynamoDB: AWS.DynamoDB): AWS.DynamoDB;
  export function reset(): void;
  export function define<Attributes>(modelName: string, config: ModelConfiguration): Model<Attributes>;
  export function createTables(callback: (err: string) => void): void;
  export function createTables(options: { [key: string]: CreateTablesOptions } | DynogelsGlobalOptions, callback: (err: string) => void): void;
  export function Set(...args: any[]): any;

  export interface DynogelsGlobalOptions {
      $dynogels: {
          pollingInterval: number;
      };
  }

  export interface CreateTablesOptions {
      readCapacity?: number;
      writeCapacity?: number;
      streamSpecification?: {
          streamEnabled: boolean;
          streamViewType: string;
      };
  }

  export type LifeCycleAction = "create" | "update" | "destroy";

  // Dynogels Model
  export interface Model<Attributes={[key:string]:any}> {
      new(attrs: Attributes): Item<Attributes>;

      get(hashKey: any, rangeKey: any, options: GetItemOptions, callback: DynogelsItemCallback<Attributes>): void;
      get(haskKey: any, options: GetItemOptions, callback: DynogelsItemCallback<Attributes>): void;
      get(hashKey: any, callback: DynogelsItemCallback<Attributes>): void;
      get(hashKey: any, rangeKey: any, callback: DynogelsItemCallback<Attributes>): void;
      create(item: any, options: CreateItemOptions, callback: DynogelsItemCallback<Attributes>): void;
      create(item: any, callback: DynogelsItemCallback<Attributes>): void;
      update(item: any, options: UpdateItemOptions, callback: DynogelsItemCallback<Attributes>): void;
      update(item: any, callback: DynogelsItemCallback<Attributes>): void;
      destroy(hashKey: any, rangeKey: any, options: DestroyItemOptions, callback: DynogelsItemCallback<Attributes>): void;
      destroy(haskKey: any, options: DestroyItemOptions, callback: DynogelsItemCallback<Attributes>): void;
      destroy(hashKey: any, callback: DynogelsItemCallback<Attributes>): void;
      destroy(hashKey: any, rangeKey: any, callback: DynogelsItemCallback<Attributes>): void;
      destroy(item: any, options: DestroyItemOptions, callback: DynogelsItemCallback<Attributes>): void;
      destroy(item: any, callback: DynogelsItemCallback<Attributes>): void;
      query(hashKey: any): Query<Attributes>;
      scan(): Scan<Attributes>;
      parallelScan(totalSegments: number): Scan<Attributes>;
      getItems(items: string[] | Array<{ [key: string]: string }>, callback: (err: Error, items: Item<Attributes>[]) => void): void;
      getItems(items: string[] | Array<{ [key: string]: string }>, options: GetItemOptions, callback: (err: Error, items: Item<Attributes>[]) => void): void;
      batchGetItems(items: string[] | Array<{ [key: string]: string }>, callback: (err: Error, items: Item<Attributes>[]) => void): void;
      batchGetItems(items: string[] | Array<{ [key: string]: string }>, options: GetItemOptions, callback: (err: Error, items: Item<Attributes>[]) => void): void;
      createTable(options: { [key: string]: CreateTablesOptions } | DynogelsGlobalOptions, callback: (err: Error, data: AWS.DynamoDB.CreateTableOutput) => void): void;
      createTable(callback: (err: Error, data: AWS.DynamoDB.CreateTableOutput) => void): void;
      updateTable(throughput: Throughput, callback: (err: Error, data: AWS.DynamoDB.UpdateTableOutput) => void): void;
      updateTable(callback: (err: Error, data: AWS.DynamoDB.UpdateTableOutput) => void): void;
      describeTable(callback: (err: Error, data: AWS.DynamoDB.DescribeTableOutput) => void): void;
      deleteTable(callback: (err: Error) => void): void;
      tableName(): string;

      after(action: LifeCycleAction, listener: (item: Item<Attributes>) => void): void;
      before(action: LifeCycleAction, listener: (data: any, next: (err: Error | null, data: any) => void) => void): void;
      config(config: ModelConfig): { name: string };
  }

  export type DynogelsItemCallback<Attributes={any:any}> = (err: Error, data: Item<Attributes>) => void;

  export interface Throughput {
      readCapacity: number;
      writeCapacity: number;
  }

  export interface CreateItemOptions {
      expected?: { [key: string]: any };
      overwrite?: boolean;

      Expected?: AWS.DynamoDB.ExpectedAttributeMap;
      ReturnValues?: AWS.DynamoDB.ReturnValue;
      ReturnConsumedCapacity?: AWS.DynamoDB.ReturnConsumedCapacity;
      ReturnItemCollectionMetrics?: AWS.DynamoDB.ReturnItemCollectionMetrics;
      ConditionalOperator?: AWS.DynamoDB.ConditionalOperator;
      ConditionExpression?: AWS.DynamoDB.ConditionExpression;
      ExpressionAttributeNames?: AWS.DynamoDB.ExpressionAttributeNameMap;
      ExpressionAttributeValues?: { [key: string]: any };
  }

  export interface UpdateItemOptions {
      expected?: { [key: string]: any };

      AttributeUpdates?: AWS.DynamoDB.AttributeUpdates;
      Expected?: AWS.DynamoDB.ExpectedAttributeMap;
      ConditionalOperator?: AWS.DynamoDB.ConditionalOperator;
      ReturnValues?: AWS.DynamoDB.ReturnValue;
      ReturnConsumedCapacity?: AWS.DynamoDB.ReturnConsumedCapacity;
      ReturnItemCollectionMetrics?: AWS.DynamoDB.ReturnItemCollectionMetrics;
      UpdateExpression?: AWS.DynamoDB.UpdateExpression;
      ConditionExpression?: AWS.DynamoDB.ConditionExpression;
      ExpressionAttributeNames?: AWS.DynamoDB.ExpressionAttributeNameMap;
      ExpressionAttributeValues?: { [key: string]: any };
  }

  export interface DestroyItemOptions {
      Expected?: AWS.DynamoDB.ExpectedAttributeMap;
      ConditionalOperator?: AWS.DynamoDB.ConditionalOperator;
      ReturnValues?: AWS.DynamoDB.ReturnValue;
      ReturnConsumedCapacity?: AWS.DynamoDB.ReturnConsumedCapacity;
      ReturnItemCollectionMetrics?: AWS.DynamoDB.ReturnItemCollectionMetrics;
      ConditionExpression?: AWS.DynamoDB.ConditionExpression;
      ExpressionAttributeNames?: AWS.DynamoDB.ExpressionAttributeNameMap;
      ExpressionAttributeValues?: { [key: string]: any };
  }

  export interface GetItemOptions {
      AttributesToGet?: AWS.DynamoDB.AttributeNameList;
      ConsistentRead?: AWS.DynamoDB.ConsistentRead;
      ReturnConsumedCapacity?: AWS.DynamoDB.ReturnConsumedCapacity;
      ProjectionExpression?: AWS.DynamoDB.ProjectionExpression;
      ExpressionAttributeNames?: AWS.DynamoDB.ExpressionAttributeNameMap;
  }

  export interface ModelConfig {
      tableName?: string;
      docClient?: any;
      dynamodb?: AWS.DynamoDB;
  }

  // Dynogels Item
  export interface Item<Attributes={any:any}> {
      get(key?: string): Attributes;
      set(params: {}): Item<Attributes>;
      save(callback?: DynogelsItemCallback<Attributes>): void;
      update(options: UpdateItemOptions, callback?: DynogelsItemCallback<Attributes>): void;
      update(callback?: DynogelsItemCallback<Attributes>): void;
      destroy(options: DestroyItemOptions, callback?: DynogelsItemCallback<Attributes>): void;
      destroy(callback?: DynogelsItemCallback<Attributes>): void;
      toJSON(): any;
      toPlainObject(): any;
  }

  export interface BaseChain<T> {
      equals(value: any): T;
      eq(value: any): T;
      lte(value: any): T;
      lt(value: any): T;
      gte(value: any): T;
      gt(value: any): T;
      null(): T;
      exists(): T;
      beginsWith(value: any): T;
      between(value1: any, value2: any): T;
  }

  export interface ExtendedChain<T> extends BaseChain<T> {
      contains(value: any): T;
      notContains(value: any): T;
      in(values: any[]): T;
      ne(value: any): T;
  }

  export interface ExecResult<Attributes> {
    Items: Item<Attributes>[],
    Count: number,
    LastEvaluatedKey?: any,
  }

  export type QueryWhereChain<Attributes={[key:string]:any}> = BaseChain<Query<Attributes>>;
  export type QueryFilterChain<Attributes={[key:string]:any}> = ExtendedChain<Query<Attributes>>;

  // Dynogels Query
  export interface Query<Attributes={any:any}> {
    limit(number: number): Query<Attributes>;
    filterExpression(expression: any): Query<Attributes>;
    expressionAttributeNames(data: any): Query<Attributes>;
    expressionAttributeValues(data: any): Query<Attributes>;
    projectionExpression(data: any): Query<Attributes>;
    usingIndex(name: string): Query<Attributes>;
    consistentRead(read: boolean): Query<Attributes>;
    addKeyCondition(condition: any): Query<Attributes>;
    addFilterCondition(condition: any): Query<Attributes>;
    startKey(hashKey: any, rangeKey: any): Query<Attributes>;
    attributes(attrs: any): Query<Attributes>;
    ascending(): Query<Attributes>;
    descending(): Query<Attributes>;
    select(value: any): Query<Attributes>;
    returnConsumedCapacity(value: any): Query<Attributes>;
    loadAll(): Query<Attributes>;
    where(keyName: string): QueryWhereChain<Attributes>;
    filter(keyName: string): QueryFilterChain<Attributes>;
    exec(): stream.Readable;
    exec(callback: (err: Error, data: ExecResult<Attributes>) => void): void;
  }

  export interface ScanWhereChain<Attributes={[key:string]:any}> extends ExtendedChain<Scan<Attributes>> {
      notNull(): Scan<Attributes>;
  }

  // Dynogels Scan
  export interface Scan<Attributes={[key:string]:any}> {
      limit(number: number): Scan<Attributes>;
      addFilterCondition(condition: any): Scan<Attributes>;
      startKey(hashKey: any, rangeKey?: any): Scan<Attributes>;
      attributes(attrs: any): Scan<Attributes>;
      select(value: any): Scan<Attributes>;
      returnConsumedCapacity(): Scan<Attributes>;
      segments(segment: any, totalSegments: number): Scan<Attributes>;
      where(keyName: string): ScanWhereChain<Attributes>;
      filterExpression(expression: any): Scan<Attributes>;
      expressionAttributeNames(data: any): Scan<Attributes>;
      expressionAttributeValues(data: any): Scan<Attributes>;
      projectionExpression(data: any): Scan<Attributes>;
      exec(): stream.Readable;
      exec(callback: (err: Error, data: ExecResult<Attributes>) => void): void;
      loadAll(): Scan<Attributes>;
  }

  export type tableResolve = () => string;

  export interface SchemaType {
      [key: string]: joi.AnySchema | SchemaType;
  }

  export interface ModelConfiguration {
      hashKey: string;
      rangeKey?: string;
      timestamps?: boolean;
      createdAt?: boolean;
      updatedAt?: string;
      schema?: SchemaType;
      validation?: joi.ValidationOptions;
      tableName?: string | tableResolve;
      indexes?: any[];
      log?: Log;
  }

  export interface Document {
      [key: string]: any;
  }

  export interface DocumentCollection {
      Items: Document[];
      Count: number;
      ScannedCount: number;
  }
}