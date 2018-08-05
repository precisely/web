import { batchCreate } from 'src/db/dynamo';

import { VariantCall, VariantCallAttributes } from './models';

export class VariantCallService {
  static async addVariantCalls(input: VariantCallAttributes[]) {
    return await batchCreate(VariantCall, input);
  }
}
