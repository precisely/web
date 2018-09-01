import { Parser } from './parser';

describe('PreciselyParser', function () {
  it('should parse a header element', function () {
    const elements = Parser.parse('# markdown title');
    expect(elements).toBeInstanceOf(Array);
    expect(elements).toEqual([
      { type: 'text',
        blocks: ['<h1>markdown title</h1>'],
        reduced: false
      }   
    ]);
  });
  
  it('should parse tags with interpolation blocks', function () {
    const elements = Parser.parse(
      '<AnalysisBox><Analysis case={ variantCall("chr1.37p13:10A>T") }></Analysis></AnalysisBox>'
    );
    expect(elements).toBeInstanceOf(Array);
  });

  it('should raise an error if an unrecognized function is called', function () {
    expect(() => Parser.parse(
      '<AnalysisBox><Analysis case={ foo("bar") }></Analysis></AnalysisBox>'
    )).toThrow();
  });
});
