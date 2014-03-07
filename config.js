var path = require('path');

/**
 * 应用根目录
 *
 * @property root_dir
 * @type String
 * @final
 */
var _root_dir = __dirname;

/**
 * 通用配置
 *
 * @property default_config
 * @type Object
 * @final
 */
var default_config = {
  app_name: 'Application',

  modules: [ 'account' ],
  secret_key: 'My Secret Key',
  debug: false,
  testing: false,
  port: 80,

  root_dir: _root_dir,
  module_dir: path.join(_root_dir, 'modules'),
  template_dir: path.join(_root_dir, 'templates'),
  static_dir: path.join(_root_dir, 'static'),
  upload_dir: path.join(_root_dir, 'static', 'upload'),
  log_dir: path.join(_root_dir, 'log'),

  db_uri: null,
  session_coookie_name: null,
  session_cookie_domain: null,
  session_cookie_path: null,
  session_cookie_httponly: true,
  session_cookie_secure: false,
  use_x_sendfile: true
};

/**
 * @class Config
 * @constructor
 * @param {Object} extend
 */
function Config(extend) {
  var self = this;
  Object.keys(default_config).forEach(function(k) {
    self[k] = default_config[k];
  });
  Object.keys(extend).forEach(function(k) { self[k] = extend[k]; });
}

/**
 * 开发环境
 *
 * @property development
 * @type Object
 * @final
 */
exports.development = new Config({
  app_name: 'node-skeleton',
  debug: true,
  port: 3001,
  db_uri: 'mongodb://localhost/skeleton_dev'
});

/**
 * 测试环境
 *
 * @property development
 * @type Object
 * @final
 */
exports.testing = new Config({
  app_name: 'node-skeleton',
  debug: true,
  port: 3001,
  db_uri: 'mongodb://localhost/skeleton_test'
});

/**
 * 生产环境
 *
 * @property development
 * @type Object
 * @final
 */
exports.production = new Config({
  app_name: 'node-skeleton',
  debug: false,
  port: 80,
  db_uri: 'mongodb://localhost/skeleton'
});
