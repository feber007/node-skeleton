var express = require('express'),
    swig = require('swig'),
    mongoose = require('mongoose'),
    path = require('path'),
    twinkle = require('node-twinkle'),            // flash messages
    current_user = require('current-user'),       // user session
    helpers = require('./helpers'),               // helper funcs
    env = process.env.NODE_ENV || 'development',
    config = require('./config')[env];            // configuration

/**
 * 应用实例
 *
 * @property app
 * @type Object
 * @final
 */
var app = express();

app.config = config;

// mongoose
function connect_db(db_uri) {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  mongoose.connect(db_uri, options);
}

connect_db(app.config.db_uri);

mongoose.connection.on('error', function(err) {
  if (app.config.debug) console.error(err.stack);
});

// 发生错误，数据库重连
mongoose.connection.on('disconnected', function() {
  connect_db(app.config.db_uri);
});
// End

// swig
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', app.config.template_dir);   // 视图文件夹
app.set('view cache', !app.config.debug);
swig.setDefaults({ cache: false });           // debug模式下关闭视图缓存
helpers.extend_swig_filters(swig);            // 添加视图filters

// middlewares - 注意顺序！
app.use(express.logger());
app.use(express.compress());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: app.config.secret_key }));
app.use('/static', express.static(app.config.static_dir));
app.use(twinkle);

// 发生异常时打印调用堆栈
if (app.config.debug) {
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
  app.locals.pretty = true;
}

/**
 * 添加一个'current_app'属性到request上下文
 * 应用在视图函数中
 *
 * Usage:
 *
 * function(req, res[, next]) {
 *   // 1. console.log(req.current_app);
 *   // 2. if (req.current_app.config.debug) {...}
 * }
 */
app.use(function(req, res, next) {
  req.current_app = app;
  next();
});

app.use(current_user());

// 路由
app.use(app.router);
app.config.modules.forEach(function(module) {
  require(path.join(app.config.module_dir, module)).init(app);
});

// 404, 500
app.use(function(req, res) { res.send(404); });
app.use(function(err, req, res, next) {
  if (app.config.debug) console.error(err.stack);
  res.send(500);
});

// 未发现模块
if (app.config.modules.length === 0) {
  app.use(function(req, res) {
    res.send('No MODULE registered, please review your project and make sure at least one module is registered.');
  });
}

var port = app.config.port || 3000;
app.listen(port);   // 启动应用实例
