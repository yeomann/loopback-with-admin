var BuildInfoGenerator, ConfigJSONGenerator, CustomConfigs, LoopbackBootGenerator, LoopbackInfo, LoopbackServer, Main, ModelsGenerator;

LoopbackInfo = require('./lib/loopback-info');

LoopbackServer = require('./lib/loopback-server');

ConfigJSONGenerator = require('./lib/config-json-generator');

ModelsGenerator = require('./lib/models-generator');

BuildInfoGenerator = require('./lib/build-info-generator');

CustomConfigs = require('./lib/custom-configs');

LoopbackBootGenerator = require('./lib/loopback-boot-generator');


/**
entry point

@class Main
 */

Main = (function() {

  /**
  entry point.
  run loopback with model definitions, config
  
  @method run
  @public
  @static
  @param {Object} loopbackDefinitions
  @param {Object|String} [config] config object or config directory containing config info
  @param {Boolean} [options.reset] reset previously-generated settings before generation
  @param {String} [options.env] set environment (production|development|...)
  @param {String} [options.participantToken] token for participant user
  @param {Object} [options.admin] options for admin token manager
  @param {Function|Array(String)} [options.admin.fetch] function to return admin tokens (or promise of it). When string[] is given, these value are used for the admin access token.
  @param {String} [options.admin.email=loopback-with-admin@example.com] email address for admin user
  @param {String} [options.admin.id=loopback-with-admin-user-id] id of admin user
  @param {String} [options.admin.password=admin-user-password] password of admin user
  @param {Number} [options.admin.intervalHours] IntervalHours to fetch new admin token.
  return {Promise(LoopbackInfo)}
   */
  Main.run = function(loopbackDefinitions, config, options) {
    var adminOptions, generated, main;
    if (options == null) {
      options = {};
    }
    main = new this(loopbackDefinitions, config, options.env);
    if (options.reset !== false) {
      main.reset();
    }
    generated = main.generate();
    if (options.adminToken) {
      console.error('LoopbackWithAdmin.run(): options.adminToken is deprecated. Use options.admin instead.');
    }
    adminOptions = options.admin || options.adminToken;
    return this.launchLoopback(adminOptions, options.participantToken).then((function(_this) {
      return function(server) {
        return new LoopbackInfo(server, generated);
      };
    })(this));
  };


  /**
  @constructor
  @private
   */

  function Main(loopbackDefinitions, configs, env) {
    var configObj, customConfigs, customRoles, modelDefinitions;
    this.env = env;
    if (loopbackDefinitions.models != null) {
      modelDefinitions = loopbackDefinitions.models;
      customRoles = loopbackDefinitions.customRoles;
    } else {
      modelDefinitions = loopbackDefinitions;
      customRoles = null;
    }
    if (this.env == null) {
      this.env = process.env.NODE_ENV || 'development';
    }
    customConfigs = new CustomConfigs(configs, this.env);
    configObj = customConfigs.toObject();
    this.configJSONGenerator = new ConfigJSONGenerator(configObj, this.env);
    this.modelsGenerator = new ModelsGenerator(modelDefinitions);
    this.bootGenerator = new LoopbackBootGenerator({
      customRoles: customRoles
    });
    this.buildInfoGenerator = new BuildInfoGenerator(modelDefinitions, configObj, this.env);
  }


  /**
  @private
   */

  Main.prototype.generate = function() {
    return {
      config: this.configJSONGenerator.generate(),
      models: this.modelsGenerator.generate(),
      buildInfo: this.buildInfoGenerator.generate(),
      bootInfo: this.bootGenerator.generate()
    };
  };


  /**
  @private
   */

  Main.prototype.reset = function() {
    this.configJSONGenerator.reset();
    this.modelsGenerator.reset();
    this.buildInfoGenerator.reset();
    return this.bootGenerator.reset();
  };


  /**
  run loopback
  
  @private
   */

  Main.launchLoopback = function(adminOptions, participantToken) {
    var server;
    server = new LoopbackServer();
    return server.launch(adminOptions, participantToken).then((function(_this) {
      return function() {
        return server;
      };
    })(this));
  };

  return Main;

})();

module.exports = Main;