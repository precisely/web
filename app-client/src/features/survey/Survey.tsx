import * as React from 'react';
import * as Survey from 'survey-react';
import Radium from 'radium';
import { graphql, OptionProps } from 'react-apollo';
import { toast } from 'react-toastify';

import * as Styles from 'src/constants/styles';
import { NavigationPage } from 'src/features/common/NavigationPage';
import { WhitePage } from 'src/features/common/WhitePage';


 // --------------------------------------------------------------------------


interface SurveyModel {
  id: number,
  name: string,
  author: string,
  version: string,
  timestamp: string,
  json: object
}


 // --------------------------------------------------------------------------


class SurveyDAO {

  static samples: SurveyModel[] = [
    {
      id: 1,
      name: 'Sample Survey 1',
      author: 'Alice',
      version: '1',
      timestamp: '???',
      json: {
        elements: [
          { type: 'text', name: 'customerName', title: 'What is your name?', isRequired: true }
        ]
      }
    },
    {
      id: 2,
      name: 'Sample Survey 2',
      author: 'Alice',
      version: '1',
      timestamp: '???',
      json: {
        elements: [
          { type: 'text', name: 'favoriteFood', title: 'What is your favorite food?', isRequired: true }
        ]
      }
    }
  ];

  static async list(): Promise<SurveyModel[]> {
    return SurveyDAO.samples;
  }

  static async get(id: number): Promise<SurveyModel> {
    return SurveyDAO.samples[id];
  }

}


 // --------------------------------------------------------------------------


type SurveyListProps = OptionProps<any>;


interface SurveyListState {
  surveyList: SurveyModel[]
}


@Radium
export class SurveyList extends React.Component<SurveyListProps, SurveyListState> {

  constructor(props: any) {
    super(props);
  }

  async componentDidMount() {
    this.state = {
      surveyList: await SurveyDAO.list()
    }
  }

  /*
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
  */

  render(): JSX.Element {
    return (
      <NavigationPage {...this.props}>
        <WhitePage>
          <h2 style={pageHeader}>Health Profile</h2>
          <div style={surveys}>
            survey list
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
};
