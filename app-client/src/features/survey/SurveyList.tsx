import * as React from 'react';
import * as Survey from 'survey-react';
import Radium from 'radium';
import { graphql, OptionProps } from 'react-apollo';
import { toast } from 'react-toastify';

import * as Styles from 'src/constants/styles';


export type SurveyListProps = OptionProps<any>;


export interface SurveyListState {
}


@Radium
export class SurveyList extends React.Component<SurveyListProps, SurveyListState> {

  constructor(props: any) {
    super(props);
    this.state = {
    };
  }

  render(): JSX.Element {
    const surveyJson = {
      elements: [
        { type: 'text', name: 'customerName', title: 'What is your name?', isRequired: true}
      ]
    };
    const surveyModel = new Survey.ReactSurveyModel(surveyJson);
    return (
      <Survey.Survey model={surveyModel} />
    );
  }

}
