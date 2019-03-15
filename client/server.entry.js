import React from 'react';
import {
  StaticRouter,
} from 'react-router-dom';
import {
  Provider,
  useStaticRendering,
} from 'mobx-react';
import JssProvider from 'react-jss/lib/JssProvider';
import {
  MuiThemeProvider,
} from '@material-ui/core/styles';

import App from './views/App';
import routes from './config/router';
import renderRouter from './route/router';
import {
  createStoreMap,
} from './store/store';

// 让mobx在服务端渲染时不会重复数据变换
useStaticRendering(true);

export default (store, sheetsRegistry, generateClassName, theme, sheetsManager,
  routerContext, url) => (
    <Provider {...store}>
      <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
        <MuiThemeProvider theme={theme} sheetsManager={sheetsManager}>
          <App>
            <StaticRouter context={routerContext} location={url}>
              {renderRouter(routes)}
            </StaticRouter>
          </App>
        </MuiThemeProvider>
      </JssProvider>
    </Provider>
);

export { createStoreMap };
