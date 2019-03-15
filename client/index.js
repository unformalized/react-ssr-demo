import ReactDOM from 'react-dom';
import React from 'react';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'mobx-react';
import {
  BrowserRouter as Router,
} from 'react-router-dom';
import {
  MuiThemeProvider, createMuiTheme,
} from '@material-ui/core/styles';
import {
  lightBlue, pink,
} from '@material-ui/core/colors';

import App from './views/App';

import routes from './config/router';
import renderRouter from './route/router';
import { AppState, TopicStore } from './store/store';

const initialState = window.__INITIAL__STATE__ || {}; // eslint-disable-line
const theme = createMuiTheme({
  palette: {
    primary: lightBlue,
    accent: pink,
    type: 'light',
  },
  typography: {
    useNextVariants: true,
  },
});

const createApp = (CurrentApp) => {
  class Main extends React.Component {
    componentDidMount() {
      const jssStyles = document.getElementById('jss-server-side');
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles);
      }
    }

    render() {
      return <CurrentApp {...this.props} />;
    }
  }
  return Main;
};

const appState = new AppState();
appState.init(initialState.appState.user);
const topicStore = new TopicStore(initialState.topicStore);

const root = document.getElementById('root');
const render = (Component) => {
  const renderMethod = module.hot ? ReactDOM.hydrate : ReactDOM.render;
  renderMethod(
    <AppContainer>
      <Provider appState={appState} topicStore={topicStore}>
        <MuiThemeProvider theme={theme}>
          <Component>
            <Router>
              {renderRouter(routes)}
            </Router>
          </Component>
        </MuiThemeProvider>
      </Provider>
    </AppContainer>, root,
  );
};

render(createApp(App));

// 热更新

if (module.hot) {
  module.hot.accept('./views/App', () => {
    const nextApp = require('./views/App').default; // eslint-disable-line
    render(createApp(nextApp));
  });
}
