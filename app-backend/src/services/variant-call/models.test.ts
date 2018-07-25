import { VariantCall } from './models';

describe('VariantCall', function () {
  describe('forUser', function () {
    it('should retrieve an instance if the user has variant calls for those ref-indexes');
    it("should retrieve an empty list if the user doesn't have variant calls for those ref-indexes");
    it('should retrieve an instance for a user given VariantCallIndexes with rsIds');
    it("should retrieve an empty list if the user doesn't have variant calls for those rsIds");
    it('should retrieve a list containing variant calls for refIndexes and rsIds');

  });

  describe('save', function () {
    it('should set the variantId correctly from the save parameters');
  });
});
