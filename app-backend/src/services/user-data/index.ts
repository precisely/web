import { VariantCall } from 'src/services/models';
import { TypedError } from 'src/errors';

export class UserData {
  variants: string[];
  userId: string;
  scopes: string[];

  constructor({ userId, variants, scopes }: {
    userId: string,
    variants?: string[],
    scopes: string[] }) {
    this.variants = variants;
    this.userId = userId;
  }

  async variantCalls(): Promise<VariantCall[]> {
    this.checkScope('variantCall:query');
    const result = await VariantCall.query(this.userId).execAsync();
    return result && result.Items;
  }



  
}
