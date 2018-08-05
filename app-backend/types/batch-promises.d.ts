declare module 'batch-promises' {
  function batchPromises<Input = any, Output = any>(
    count: number, input: Input[], generator: (i: Input) => Promise<Output>): Promise<Output[]>;
  export = batchPromises;
}
