import {Parser, markdownItEngine} from 'smart-report';

export const PreciselyParser = new Parser({
  markdownEngine: markdownItEngine()
});
