import { ReducibleTagElement, Context, ReducerFunction, Attributes, removeTags } from 'smart-report';

// https://github.com/precisely/web/issues/202
// <AnalysisBox title="mek3" subtitle={} highlight={}>
//   <Analysis case={}>
//   </Analysis >
//   <AnalysisCase case={}>
//   </Analysis>
//

export const AnalysisBox: ReducerFunction = (elt: ReducibleTagElement, ctx: Context) => {
  // console.log('analysisBox: %s', JSON.stringify(elt, null, 2), ctx);
  return [removeTags(elt.children, ({__name, case: caseValue }: Attributes) => {
    return __name === 'analysis' && !caseValue;
  }), ctx];
};
