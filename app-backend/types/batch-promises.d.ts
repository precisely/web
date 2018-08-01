declare module 'batch-promises' {
  function batchPromises<I = any, T = any>(
    count: number, input: I[], generator: (i: I) => Promise<T>): Promise<T[]>;
  export = batchPromises;
}
