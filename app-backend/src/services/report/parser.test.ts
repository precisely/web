import { PreciselyParser } from './parser';

describe('PreciselyParser', function () {
  it('should parse a header element', function () {
    const elements = PreciselyParser.parse('# markdown title');
    expect(elements).toBeInstanceOf(Array);
    expect(elements).toEqual([
      { type: 'text',
        blocks: ['<h1>markdown title</h1>'],
        reduced: false
      }   
    ]);
  });
  
  it('should parse tags with interpolation blocks', function () {
    const elements = PreciselyParser.parse(
      '<AnalysisBox><Analysis case={ variant("chr1:10A>T") }></Analysis></AnalysisBox>'
    );
    expect(elements).toBeInstanceOf(Array);
  });

  it('should raise tags with interpolation blocks', function () {
    const elements = PreciselyParser.parse(
      '<AnalysisBox><Analysis case={ variant("chr1:10A>T") }></Analysis></AnalysisBox>'
    );
    expect(elements).toBeInstanceOf(Array);
  });
});
