import { Parser } from './parser';
import { Analyzer } from './analyzer';
import { isArray } from 'util';

describe('SmartReport Analyzer', function () {
  describe('extractRequirements', function () {
    it('should collect variants in the __svnVariantRequirements key of the context', function () {
      const {elements, errors} = Parser.parse(
        `<AnalysisPanel>
          <Analysis case={ variantCall("chr1.37p13:g.[10A>T];[10=]") }/>
          <Analysis case={ variantCall("chr2.37p13:g.[20A>T];[20=]") }/>
        </AnalysisPanel>`);
      const {variantIndexes} = Analyzer.extractRequirements(elements);
      expect(variantIndexes).toBeDefined();
      expect(errors).toHaveLength(0);
      expect(isArray(variantIndexes)).toBeTruthy();
      expect(variantIndexes).toHaveLength(2);
      expect(variantIndexes).toEqual([
        { refName: 'chr1', refVersion: '37p13', start: 10 },
        { refName: 'chr2', refVersion: '37p13', start: 20 }
      ]);
    });
  });
});
