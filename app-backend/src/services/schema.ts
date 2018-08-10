import gql from 'graphql-tag';

import variantCallSchema from './variant-call/schema';
import reportSchema from './report/schema';

const mainSchema = [gql`
type Query 

type Mutation

scalar JSON`];

export default [...mainSchema, ...variantCallSchema, ...reportSchema];
