import { Parser } from './parser';

describe('PreciselyParser', function () {
  it('should parse a header element', function () {
    const { elements, errors } = Parser.parse('# markdown title');
    expect(errors).toHaveLength(0);
    expect(elements).toBeInstanceOf(Array);
    expect(elements).toEqual([
      { type: 'text',
        blocks: ['<h1>markdown title</h1>'],
        reduced: false
      }   
    ]);
  });
  
  it('should parse tags with interpolation blocks', function () {
    const {elements, errors} = Parser.parse(
      '<AnalysisBox><Analysis case={ variantCall("chr1.37p13:10A>T") }></Analysis></AnalysisBox>'
    );
    expect(errors).toHaveLength(0);
    expect(elements).toBeInstanceOf(Array);
  });

  it('should return an error if an unrecognized function is called', function () {
    const {elements, errors} = Parser.parse(
      '<AnalysisBox><Analysis case={ foo("bar") }></Analysis></AnalysisBox>'
    );
    expect(elements).toBeInstanceOf(Array);
    expect(errors).toHaveLength(1);
  });
});
