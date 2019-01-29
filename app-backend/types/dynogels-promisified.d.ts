declare module "@aneilbaboo/dynogels-promisified" {
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
  export function define<Attributes, Methods={}>(
    modelName: string,
    config: ModelConfiguration
  ): Model<Attributes, Methods>;

  export function createTables(callback: (err: Error | string) => void): void;
  export function createTables(
    options: { [key: string]: CreateTablesOptions } | DynogelsGlobalOptions,
    callback: (err: string) => void
  ): void;
  export function createTablesAsync(): Promise<void>;
  export function createTablesAsync(
    options: { [key: string]: CreateTablesOptions } | DynogelsGlobalOptions
  ): Promise<void>;
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

  export type ListenerNextFunction = (err: Error | null, data?: any) => void;

  export interface Model<Attributes = { [key: string]: any }, Methods = {} > {
    new (attrs: Attributes): Item<Attributes, Methods>;

    get(
      hashKey: any,
      rangeKey: any,
      options: GetItemOptions,
      callback: DynogelsItemCallback<Attributes, Methods>
    ): void;
    get(
      haskKey: any,
      options: GetItemOptions,
      callback: DynogelsItemCallback<Attributes, Methods>
    ): void;
    get(hashKey: any, callback: DynogelsItemCallback<Attributes, Methods>): void;
    get(
      hashKey: any,
      rangeKey: any,
      callback: DynogelsItemCallback<Attributes, Methods>
    ): void;
    create(
      item: any,
      options: CreateItemOptions,
      callback: DynogelsItemCallback<Attributes, Methods>
    ): void;
    create(item: any, callback: DynogelsItemCallback<Attributes, Methods>): void;
    update(
      item: any,
      options: UpdateItemOptions,
      callback: DynogelsItemCallback<Attributes, Methods>
    ): void;
    update(item: any, callback: DynogelsItemCallback<Attributes, Methods>): void;
    destroy(
      hashKey: any,
      rangeKey: any,
      options: DestroyItemOptions,
      callback: DynogelsItemCallback<Attributes, Methods>
    ): void;
    destroy(
      haskKey: any,
      options: DestroyItemOptions,
      callback: DynogelsItemCallback<Attributes, Methods>
    ): void;
    destroy(hashKey: any, callback: DynogelsItemCallback<Attributes, Methods>): void;
    destroy(
      hashKey: any,
      rangeKey: any,
      callback: DynogelsItemCallback<Attributes, Methods>
    ): void;
    destroy(
      item: any,
      options: DestroyItemOptions,
      callback: DynogelsItemCallback<Attributes, Methods>
    ): void;
    destroy(item: any, callback: DynogelsItemCallback<Attributes, Methods>): void;
    query(hashKey: any): Query<Attributes, Methods>;
    scan(): Scan<Attributes, Methods>;
    parallelScan(totalSegments: number): Scan<Attributes, Methods>;
    getItems(
      items: string[] | Array<{ [key: string]: string }>,
      callback: (err: Error, items: Item<Attributes, Methods>[]) => void
    ): void;
    getItems(
      items: string[] | Array<{ [key: string]: string }>,
      options: GetItemOptions,
      callback: (err: Error, items: Item<Attributes, Methods>[]) => void
    ): void;
    batchGetItems(
      items: string[] | Array<{ [key: string]: string }>,
      callback: (err: Error, items: Item<Attributes, Methods>[]) => void
    ): void;
    batchGetItems(
      items: string[] | Array<{ [key: string]: string }>,
      options: GetItemOptions,
      callback: (err: Error, items: Item<Attributes, Methods>[]) => void
    ): void;
    dynamoCreateTableParams(): Object;
    dynamoCreateTableParams(options: { [key: string]: CreateTablesOptions } | DynogelsGlobalOptions): Object;
    createTable(
      options: { [key: string]: CreateTablesOptions } | DynogelsGlobalOptions,
      callback: (err: Error, data: AWS.DynamoDB.CreateTableOutput) => void
    ): void;
    createTable(
      callback: (err: Error, data: AWS.DynamoDB.CreateTableOutput) => void
    ): void;
    updateTable(
      throughput: Throughput,
      callback: (err: Error, data: AWS.DynamoDB.UpdateTableOutput) => void
    ): void;
    updateTable(
      callback: (err: Error, data: AWS.DynamoDB.UpdateTableOutput) => void
    ): void;
    describeTable(
      callback: (err: Error, data: AWS.DynamoDB.DescribeTableOutput) => void
    ): void;
    deleteTable(callback: (err: Error) => void): void;
    tableName(): string;

    after(
      action: LifeCycleAction,
      listener: (item: Item<Attributes, Methods>) => void
    ): void;
    before(
      action: LifeCycleAction,
      listener: (data: any, next: ListenerNextFunction) => void
    ): void;
    config(config: ModelConfig): { name: string };

    getAsync(
      hashKey: any,
      rangeKey: any,
      options: GetItemOptions
    ): Promise<Item<Attributes, Methods>>;
    getAsync(haskKey: any, options: GetItemOptions): Promise<Item<Attributes, Methods>>;
    getAsync(hashKey: any): Promise<Item<Attributes, Methods>>;
    getAsync(hashKey: any, rangeKey: any): Promise<Item<Attributes, Methods>>;
    createAsync(
      item: Attributes | Attributes[],
      options: CreateItemOptions
    ): Promise<Item<Attributes, Methods>>;
    createAsync(item: Attributes | Attributes[]): Promise<Item<Attributes, Methods>>;
    updateAsync(
      item: Attributes,
      options: UpdateItemOptions
    ): Promise<Item<Attributes, Methods>>;
    updateAsync(item: Attributes): Promise<Item<Attributes, Methods>>;
    destroyAsync(
      hashKey: any,
      rangeKey: any,
      options: DestroyItemOptions
    ): Promise<Item<Attributes, Methods>>;
    destroyAsync(
      haskKey: any,
      options: DestroyItemOptions
    ): Promise<Item<Attributes, Methods>>;
    destroyAsync(hashKey: any): Promise<Item<Attributes, Methods>>;
    destroyAsync(hashKey: any, rangeKey: any): Promise<Item<Attributes, Methods>>;
    destroyAsync(
      item: Attributes,
      options: DestroyItemOptions
    ): Promise<Item<Attributes, Methods>>;
    destroyAsync(item: Attributes): Promise<Item<Attributes, Methods>>;
    parallelScan(totalSegments: number): Scan<Attributes, Methods>;
    getItemsAsync(
      items: string[] | Array<{ [key: string]: string }>
    ): Promise<Item<Attributes, Methods>[]>;
    getItemsAsync(
      items: string[] | Array<{ [key: string]: string }>,
      options: GetItemOptions
    ): Promise<Item<Attributes, Methods>[]>;
    batchGetItemsAsync(
      items: string[] | Array<{ [key: string]: string }>
    ): Promise<Item<Attributes, Methods>[]>;
    batchGetItemsAsync(
      items: string[] | Array<{ [key: string]: string }>,
      options: GetItemOptions
    ): Promise<Item<Attributes, Methods>[]>;
    createTableAsync(
      options: { [key: string]: CreateTablesOptions } | DynogelsGlobalOptions
    ): Promise<AWS.DynamoDB.CreateTableOutput>;
    createTableAsync(): Promise<AWS.DynamoDB.CreateTableOutput>;
    updateTableAsync(
      throughput: Throughput
    ): Promise<AWS.DynamoDB.UpdateTableOutput>;
    updateTableAsync(): Promise<AWS.DynamoDB.UpdateTableOutput>;
    describeTableAsync(): Promise<AWS.DynamoDB.DescribeTableOutput>;
    deleteTableAsync(): void;

    schema: any;
  }

  export type DynogelsItemCallback<Attributes = { any: any }, Methods = {}> = (
    err: Error,
    data: Item<Attributes, Methods>
  ) => void;

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

  export type Item<Attributes = { any: any }, Methods extends {} = {}> = Methods & {
    attrs: Attributes;
    get<K extends keyof Attributes>(key: K): Attributes[K];
    get(): Attributes;
    set(params: {}): Item<Attributes, Methods>;
    save(callback?: DynogelsItemCallback<Attributes, Methods>): void;
    update(
      options: UpdateItemOptions,
      callback?: DynogelsItemCallback<Attributes, Methods>
    ): void;
    update(callback?: DynogelsItemCallback<Attributes, Methods>): void;
    destroy(
      options: DestroyItemOptions,
      callback?: DynogelsItemCallback<Attributes, Methods>
    ): void;
    destroy(callback?: DynogelsItemCallback<Attributes, Methods>): void;
    toJSON(): any;
    toPlainObject(): any;

    saveAsync(): Promise<Item<Attributes, Methods>>;
    updateAsync(options: UpdateItemOptions): Promise<Item<Attributes, Methods>>;
    updateAsync(): Promise<Item<Attributes, Methods>>;
    destroyAsync(options: DestroyItemOptions): Promise<Item<Attributes, Methods>>;
    destroyAsync(): Promise<Item<Attributes, Methods>>;
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

  export interface ExecResult<Attributes, Methods> {
    Items: Item<Attributes, Methods>[];
    Count: number;
    LastEvaluatedKey?: any;
  }

  //export type QueryWhereChain<Attributes={[key:string]:any}> = BaseChain<Query<Attributes, Methods>>;
  export type QueryChain<Attributes = { [key: string]: any }, Methods = {}> = ExtendedChain<
    Query<Attributes, Methods>
  >;

  export interface Query<Attributes = { any: any }, Methods = {}> {
    limit(number: number): Query<Attributes, Methods>;
    filterExpression(expression: any): Query<Attributes, Methods>;
    expressionAttributeNames(data: any): Query<Attributes, Methods>;
    expressionAttributeValues(data: any): Query<Attributes, Methods>;
    projectionExpression(data: any): Query<Attributes, Methods>;
    usingIndex(name: string): Query<Attributes, Methods>;
    consistentRead(read: boolean): Query<Attributes, Methods>;
    addKeyCondition(condition: any): Query<Attributes, Methods>;
    addFilterCondition(condition: any): Query<Attributes, Methods>;
    startKey(hashKey: any, rangeKey: any): Query<Attributes, Methods>;
    attributes(attrs: any): Query<Attributes, Methods>;
    ascending(): Query<Attributes, Methods>;
    descending(): Query<Attributes, Methods>;
    select(value: any): Query<Attributes, Methods>;
    returnConsumedCapacity(value: any): Query<Attributes, Methods>;
    loadAll(): Query<Attributes, Methods>;
    where(keyName: string): QueryChain<Attributes, Methods>;
    filter(keyName: string): QueryChain<Attributes, Methods>;
    exec(): stream.Readable;
    exec(callback: (err: Error, data: ExecResult<Attributes, Methods>) => void): void;

    execAsync(): Promise<ExecResult<Attributes, Methods>>;
  }

  export interface ScanWhereChain<Attributes = { [key: string]: any }, Methods = {}> extends ExtendedChain<Scan<Attributes, Methods>>{
    notNull(): Scan<Attributes, Methods>;
  }

  export interface Scan<Attributes = { any: any }, Methods = {}> {
    limit(number: number): Scan<Attributes, Methods>;
    addFilterCondition(condition: any): Scan<Attributes, Methods>;
    startKey(hashKey: any, rangeKey?: any): Scan<Attributes, Methods>;
    attributes(attrs: any): Scan<Attributes, Methods>;
    select(value: any): Scan<Attributes, Methods>;
    returnConsumedCapacity(): Scan<Attributes, Methods>;
    segments(segment: any, totalSegments: number): Scan<Attributes, Methods>;
    where(keyName: string): ScanWhereChain<Attributes, Methods>;
    filter(keyName: string): ScanWhereChain<Attributes, Methods>;
    filterExpression(expression: any): Scan<Attributes, Methods>;
    expressionAttributeNames(data: any): Scan<Attributes, Methods>;
    expressionAttributeValues(data: any): Scan<Attributes, Methods>;
    projectionExpression(data: any): Scan<Attributes, Methods>;
    exec(): stream.Readable;
    exec(callback: (err: Error, data: ExecResult<Attributes, Methods>) => void): void;
    loadAll(): Scan<Attributes, Methods>;

    execAsync(): Promise<ExecResult<Attributes, Methods>>;
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
