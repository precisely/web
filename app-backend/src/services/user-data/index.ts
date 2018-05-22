import { VariantCall } from 'src/services/models';

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
    const result = await VariantCall.query(this.userId).execAsync();
    return result && result.Items;
  }

  // in future
  // surveys
  

}
