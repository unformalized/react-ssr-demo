import React from 'react';
import PropsType from 'prop-types';

import AppBar from './layout/app.bar';

class App extends React.Component {
  componentDidMount() {
    // do something here
  }

  render() {
    const { children } = this.props;
    return (
      <div>
        <AppBar />
        {children}
      </div>
    );
  }
}

App.propTypes = {
  children: PropsType.node.isRequired,
};

export default App;
