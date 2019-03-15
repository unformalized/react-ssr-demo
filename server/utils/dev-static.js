const axios = require('axios');
const webpack = require('webpack');
const path = require('path');
const MemoryFs = require('memory-fs');
const proxy = require('http-proxy-middleware');
const serverRender = require('./server-render.js');

// 获取配置文件
const serverConfig = require('../../build/webpack.config.server.js');

// 开发环境时从本地网络中获取HTML模板
const fetchTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/server.ejs').then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err);
    });
  });
};

/**
 * 打包优化，将依赖分离出来
 */

// const Module = module.constructor;
const NativeModule = require('module');
const vm = require('vm');
const getModuleFormString = (bundle, filename) => {
  const m = { exports: {} };
  const wrapper = NativeModule.wrap(bundle);
  const script = new vm.Script(wrapper, {
    filename: filename,
    displayErrors: true
  });
  const result = script.runInThisContext();
  result.call(m.exports, m.exports, require, m);
  return m;
};

const memoryfs = new MemoryFs();
const serverCompiler = webpack(serverConfig);
let serverBundle, bundlePath, bundle, m;

// 配置webpack的文件读写在内存中执行
serverCompiler.outputFileSystem = memoryfs;
// 监听webpack的entry变化
serverCompiler.watch({}, (err, status) => {
  if (err) throw err;
  status = status.toJson();
  status.errors.forEach(err => console.error(err));
  status.warnings.forEach(warning => console.warn(warning));

  bundlePath = path.join(
    serverConfig.output.path,
    serverConfig.output.filename
  );
  bundle = memoryfs.readFileSync(bundlePath, 'utf-8');
  // m = new Module();
  // m._compile(bundle, 'server-entry.js');
  // serverBundle = m.exports.default;
  // createStoreMap = m.exports.createStoreMap;
  m = getModuleFormString(bundle, 'server-entry.js');
  serverBundle = m.exports;
});

module.exports = (App) => {
  /**
   * get('*')会导致静态文件的获取会返回html文件， server.js 里采用express.static解决
   * 这里使用proxy代理方式 devServer.proxy 原理一样
  */
  App.use('/public', proxy({
    target: 'http://localhost:8888'
  }));
  App.get('*', (req, res, next) => {
    if (!serverBundle) {
      console.log('waiting for compile, refresh later');
    }
    fetchTemplate().then(template => {
      return serverRender(serverBundle, template, req, res);
    }).catch(next);
  });
};
