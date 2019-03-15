const express = require('express');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const serverRender = require('./utils/server-render.js');

const isDev = process.env.NODE_ENV === 'development';
const App = express();

App.use(bodyParser.json());
App.use(bodyParser.urlencoded({ extended: false }));

App.use(session({
  maxAge: 10 * 60 * 1000,
  secret: 'react-cnode-class',
  name: 'tid',
  resave: false,
  saveUninitialized: false
}));

App.use(favicon(path.join(__dirname, '../favicon.ico')));
App.use('/api/user', require('./utils/handle.login'));
App.use('/api', require('./utils/proxy'));

if (!isDev) {
  // 生产环境
  const template = fs.readFileSync(path.join(__dirname, '../dist/server.ejs'), 'utf8');
  /**
   * export default 会返回一个对象，{
   *  default: { 真正的内容 }
   * }
  */
  const serverEntry = require('../dist/server-entry.js');
  // 配合webpack的publicPath 整合/public的静态文件
  App.use('/public', express.static(path.join(__dirname, '../dist')));
  App.get('*', (req, res, next) => {
    serverRender(serverEntry, template, req, res).catch(next);
  });
} else {
  // 开发环境
  const devStatic = require('./utils/dev-static.js');
  devStatic(App);
}

App.use((error, req, res, next) => {
  console.log(error);
  res.status(500).send(error);
});

App.listen(3033, () => {
  console.log('server is start in port 3033');
});
