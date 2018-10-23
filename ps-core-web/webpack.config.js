const factory = require(`./js/services/service_factory`),
  webpack = require(`webpack`),
  url = require(`url`),
  smartAngular = require(`smart-angular`),
  save2json = require(`smart-angular-save2json`),
  __DEVELOPMENT__ = {
  devtool : 'inline-source-map',
  mode : "development",
  devServer: {
    open : true,
    openPage : "app-oc/index.html",
    contentBase: "./",
    inline: true,
    before : function(app){
      smartAngular.run("webpackdev", "core")(app);
      save2json(app);
    },
    proxy : {
      '/api' : {
        target : factory.origin,
        security : false,
        changeOrigin : true
      }
    }
  }
};
module.exports = __DEVELOPMENT__;
