var mongo = require("mongodb").MongoClient,
asynch = require("async"),
dbconfig = require("../config.json");


exports.initdb = function(callback){
  asynch.waterfall(
    [
      function connectDB(cb){
        var url = dbconfig.config.db_config.host_url;
        console.log(url);
        mongo.connect(url, {poolSize:100, w: 1},cb);
      },
      function createUserCollection(data, cb){
        console.log("Creating Collection User");
        exports.UserCol = data.collection("User",cb);
      }
    ],callback);
  };
exports.UserCol=null;
