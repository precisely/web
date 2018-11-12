import * as React from 'react';
import { SmartReport } from './SmartReport';
import * as Adapter from 'enzyme-adapter-react-16';
import {shallow, mount, configure} from 'enzyme';
import { Variant } from './components/Variant';

configure({adapter: new Adapter()});

describe('SmartReport', () => {
  const smartReport = (elements: any[]) => {
    return <SmartReport elements={elements} />;
  };

  const htmlDiv = (html: string) => {
    return <div dangerouslySetInnerHTML={{__html: html}}/>;
  };

  it('should render empty elements', () => {
    expect(shallow(smartReport([]))).toHaveLength(1);
  });

  it('should render a text element', () => {
    expect(shallow(smartReport([
      { type: 'text', blocks: ['<p>Hello</p>']}
    ])).html()).toEqual('<div class="smart-report"><div><p>Hello</p></div></div>');

    // the same test using htmlDiv:
    expect(mount(smartReport([
      { type: 'text', blocks: ['<p>Hello</p>']}
    ])).contains(<div className="smart-report">{htmlDiv('<p>Hello</p>')}</div>)).toBeTruthy();
  });

  it('should render a text element with multiple blocks', () => {
    expect(mount(smartReport([
      { type: 'text', blocks: ['<p>Hello', ' Sailor!</p>']}
    ])).contains(<div className="smart-report">{htmlDiv('<p>Hello Sailor!</p>')}</div>)).toBeTruthy();
  });

  it('should render multiple text elements', () => {
    expect(mount(smartReport([
      { type: 'text', blocks: ['<p>Hello', ' Sailor!</p>']},
      { type: 'text', blocks: ['<p>What\'s up, doc?</p>']}
    ])).contains((
      <div className="smart-report">
        {htmlDiv('<p>Hello Sailor!</p>')}
        {htmlDiv("<p>What's up, doc?</p>")}
      </div>))).toBeTruthy();
  });

  describe('when personalizing', () => {
    it('should render a personalized AnalysisPanel with no elements', () => {
      expect(mount(smartReport([
        { type: 'tag', name: 'analysispanel', attrs: { personalize: true }, children: [] }
      ])).html()).toEqual('<div class="smart-report"></div>');
    });

    it('should render an AnalysisPanel with one child Analysis element', () => {
      expect(mount(smartReport([
        { type: 'tag', name: 'analysispanel', attrs: { personalize: true, titlePrefix: 'prefix' }, children: [{
          type: 'tag', name: 'analysis', attrs: { title: 'foo' }, children: []
        }] }
      ])).containsMatchingElement(<div><h1>prefix foo</h1></div>)).toBeTruthy();
    });

    it('should render an AnalysisPanel with one child Analysis element containing text', () => {
      expect(mount(smartReport([
        { type: 'tag', name: 'analysispanel', attrs: { personalize: true }, children: [{
          type: 'tag', name: 'analysis', attrs: { title: 'foo' }, children: [{
            type: 'text', blocks: ['<p>bar</p>']
          }]
        }] }
      ])).containsMatchingElement(<div><h1>foo</h1>{htmlDiv('<p>bar</p>')}</div>)).toBeTruthy();
    });
  });

  describe('when not personalized', () => {
    it('should render an image in the AnalysisPanel representing blank text', () => {
      expect(mount(smartReport([
        { type: 'tag', name: 'analysispanel', attrs: { personalize: false }, children: [{
          type: 'tag', name: 'analysis', attrs: { title: 'foo' }, children: [{
            type: 'text', blocks: ['<p>bar</p>']
          }]
        }] }
      ])).containsMatchingElement((
        <div><h1>Your Personalized Analysis</h1>
          <div>
            <p><img/></p>
            <p><img/></p>
          </div>
        </div>))).toBeTruthy();
    });
  });

  it('should render a GeneMap', () => {
    expect(mount(smartReport([{
      type: 'tag', name: 'genemap', attrs: {start: 10, end: 100}, children: [{
        type: 'text', blocks: ['<p>bar</p>']
      }]
    }])).contains(<div><p>GeneMap showing variants from 10 to 100 goes here</p>{htmlDiv('<p>bar</p>')}</div>)).toBeTruthy();
  });

  it('should render a Variant', () => {
    expect(mount(smartReport([{
      type: 'tag', name: 'variant', attrs: {pos: 10, refBases: 'A', altBases: 'T'}, children: []
    }])).contains(<div><p>Variant at 10 showing A to T change</p></div>)).toBeTruthy();
  });

  it('should render Variants inside a GeneMap', () => {
    const wrapper = mount(smartReport([{
      type: 'tag', name: 'genemap', attrs: {start: 10, end: 100}, children: [{
        type: 'tag', name: 'variant', attrs: { pos: 50, refBases: 'A', altBases: 'T' }, children: [
          {type: 'text', blocks: ['<p>foo</p>'] }
        ]
      }]
    }]));

    expect(
      wrapper.contains((
        <div><p>GeneMap showing variants from 10 to 100 goes here</p>
          <Variant pos={50} refBases="A" altBases="T">
            {htmlDiv('<p>foo</p>')}
          </Variant>
        </div>
      ))
    ).toBeTruthy();
  });

  it('should render a PieChart', () => {
    const wrapper = mount(smartReport([{
      type: 'tag', name: 'piechart', attrs: {percentage: 95}, children: []
    }]));
    expect(
      wrapper.contains((
        <p>PieChart with percentage = {95}% goes here</p>
      ))
    ).toBeTruthy();
  });
});
