var registerApp;

module.exports = function(app, cb) {
  var Installation;
  Installation = app.models.installation;
  Installation.observe('before save', function(ctx, next) {
    if (ctx.instance) {
      ctx.instance.appId = 'loopback-with-admin';
    }
    return next();
  });
  return registerApp(app, cb);
};


/**
registers an application instance for push notification service

@method registerApp
 */

registerApp = function(app, cb) {
  var Application, buildInfo, config;
  Application = app.models.application;
  config = require('../push-credentials');
  buildInfo = require('../build-info');
  Application.observe('before save', function(ctx, next) {
    ctx.instance.id = 'loopback-with-admin';
    return next();
  });
  return Application.register('CureApp, Inc.', 'loopback-with-admin', {
    descriptions: '',
    pushSettings: {
      apns: {
        production: buildInfo.env === 'production',
        certData: config.apnsCertData,
        keyData: config.apnsKeyData,
        feeedbackOptions: {
          batchFeedback: true,
          interval: 300
        }
      },
      gcm: {
        serverApiKey: config.gcmServerApiKey
      }
    }
  }, function(err, savedApp) {
    if (err) {
      console.log(err);
    }
    return cb();
  });
};