const ReactDOMServer = require('react-dom/server.js');
const bootstrap = require('react-async-bootstrapper');
const ejs = require('ejs');
const serialize = require('serialize-javascript');
const Helmet = require('react-helmet').default;
const SheetsRegistry = require('jss').SheetsRegistry;
const createMuiTheme = require('@material-ui/core/styles').createMuiTheme;
const createGenerateClassName = require('@material-ui/core/styles').createGenerateClassName;

const getStoreState = (stores) => {
  return Object.keys(stores).reduce((result, storeName) => {
    result[storeName] = stores[storeName].toJson();
    return result;
  }, {});
};

const sheetsRegistry = new SheetsRegistry();
const sheetsManager = new Map();

const theme = createMuiTheme({
  palette: {
    primary: require('@material-ui/core/colors').lightBlue,
    accent: require('@material-ui/core/colors').pink,
    type: 'light'
  },
  typography: {
    useNextVariants: true
  }
});

const generateClassName = createGenerateClassName();

module.exports = (bundle, template, req, res) => {
  return new Promise((resolve, reject) => {
    const createStoreMap = bundle.createStoreMap;
    const createApp = bundle.default;
    const routerContext = {};
    const stores = createStoreMap();
    const user = req.session.user;

    if (user) {
      stores.appState.user.isLogin = true;
      stores.appState.user.info = user;
    }

    const app = createApp(stores, sheetsRegistry, generateClassName, theme, sheetsManager, routerContext, req.url);

    bootstrap(app).then(() => {
      const helmet = Helmet.rewind();
      const state = getStoreState(stores);
      const content = ReactDOMServer.renderToString(app);
      // 服务端渲染优化，在服务端完成router的redirect
      if (routerContext.url) {
        res.status(302).setHeader('Location', routerContext.url);
        res.end();
        return;
      }
      const css = sheetsRegistry.toString();

      const html = ejs.render(template, {
        appString: content,
        css: css,
        initialState: serialize(state),
        meta: helmet.meta.toString(),
        title: helmet.title.toString(),
        style: helmet.style.toString(),
        link: helmet.link.toString()
      });
      res.send(html);
      resolve();
    }).catch(reject);
  });
};
