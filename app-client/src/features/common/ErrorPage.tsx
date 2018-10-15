import * as React from 'react';
import { ErrorView } from 'src/features/common/ErrorView';
import { NavigationPage } from 'src/features/common/NavigationPage';
import { UnknownError, DisplayError } from 'src/errors/display-error';

export class ErrorPage extends React.Component<any, { error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { error: this.props.error };
  }

  componentDidCatch(error: any, info: any) {
    const displayError = (error instanceof DisplayError)
      ? error
      : new UnknownError();
    // Display fallback UI
    this.setState({ error: displayError });
    // You can also log the error to an error reporting service
    console.log(error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <NavigationPage>
          <ErrorView error={this.state.error} />
        </NavigationPage>
      );
    }
    return this.props.children;
  }
}
