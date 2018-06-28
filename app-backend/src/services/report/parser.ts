import {Parser, Reducer, markdownItEngine} from 'smart-report';
import {ReducerFunction, ReducibleTagElement, Context} from 'smart-report/lib/types';

export const PreciselyParser = new Parser({
  markdownEngine: markdownItEngine()
});

const Highlight: ReducerFunction = (element: ReducibleTagElement, context: Context) => {
  return [element.children, context];
};

export const PreciselyAnalyzer = new Reducer({
  components: {
    Highlight
  }
});
