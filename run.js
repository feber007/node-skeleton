var env = process.env.NODE_ENV || 'development',
    config = require('./config')[env],            // configuration
    init_app = require('./app').init_app;

// 实例化应用
var app = init_app(config);

// 启动应用实例
var port = app.config.port || 3000;
app.listen(port, function() {
  console.info('Application running on port %d.'.green, port);
  console.info('You can now visit '.green +
               'http://localhost:3001/'.underline.blue +
               ' via your browser.'.green);
});
