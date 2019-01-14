import * as React from 'react';
import * as Survey from 'survey-react';
import Radium from 'radium';
import { graphql, OptionProps } from 'react-apollo';
import { toast } from 'react-toastify';

import * as Styles from 'src/constants/styles';
import { NavigationPage } from 'src/features/common/NavigationPage';
import { WhitePage } from 'src/features/common/WhitePage';


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
      <NavigationPage {...this.props}>
        <WhitePage>
          <h2 style={pageHeader}>Health Profile</h2>
          <div style={surveys}>
            <Survey.Survey model={surveyModel} />
          </div>
        </WhitePage>
      </NavigationPage>
    );
  }

}


const fontWeight: React.CSSProperties = {
  fontWeight: 200,
};

const pageHeader: React.CSSProperties = {
  ...fontWeight,
  fontSize: '40px',
  marginTop: '-3px',
};

const surveys: React.CSSProperties = {
  marginTop: '10px'
}
