import {addFixtures} from 'src/common/fixtures';

import {VariantCallAttributes, VariantCall} from './models';

export function addVariants(
  ...argsList: VariantCallAttributes[]
): Promise<VariantCall[]> {
  return addFixtures(...argsList.map(attrs => {
    return new VariantCall(<VariantCallAttributes> attrs);
  }));
}
