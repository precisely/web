export type RefIndex = {refName: string, refVersion: string, start: number};
export type VariantCallIndexes = {
  refIndexes: RefIndex[] 
  rsIds: string[]
};
