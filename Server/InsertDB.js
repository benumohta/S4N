var dbconfig= require('./db.js'),
    lib = require("./library.js"),
    async = require("async"),
    bcrypt = require('bcrypt')
    monogoObjId =  require('mongodb').ObjectId;


var users = [];

exports.insertdb = function(users, callback){

    async.waterfall([
      function(cb){
        bcrypt.hash(users.password, 10, cb);
      },
      function insertUser(hash,cb){

        var write = {
            email_address: users.email,
            display_name: users.display_name,
            password: hash,
            first_seen_date: lib.now_in_s(),
            last_modified_date: lib.now_in_s(),
            deleted: false,
            addressLine1 : users.addressLine1,
            addressLine2 : users.addressLine2,
            city : users.city,
            compnayName : users.compnayName,
            state:users.state,
            pincode:users.pincode
        };
        dbconfig.UserCol.insertOne(write,cb)
      }
    ],
      function(err,results){
        if(err){
          callback(err,null);
        }else{
          callback(null,results);
        }
    });
};

exports.getUsers = function(callback){

      console.log(dbconfig.UserCol);
      var cursor = dbconfig.UserCol.find();
      console.log(cursor);
      cursor.on("data",(doc)=>
      {
          console.log(doc);
          users.push(doc);
      });

      cursor.on("end",  ()=>{
        exports.users = users;
        callback(null)
      });

      cursor.on("error",(err)=>{
        callback(err);
      })

};
exports.users = null;


exports.findUser = function(email,callback){
    dbconfig.UserCol.find({email_address:email}).toArray((err,data)=>{
      // err= "Error Occured";
      if(err){
        console.log("Inside DB Err");
        callback(err,null);
      }
      else {
        console.log("Inside DB success");
        callback(null,data);
      }
    });
};


exports.findUserById = function(userid,callback){
    var objId = new monogoObjId(userid);
    dbconfig.UserCol.find({_id:objId}).toArray((err,data)=>{
      // err= "Error Occured";
      if(err){
        // console.log("Inside DB Err");
        callback(err,null);
      }
      else {
        // console.log("Inside DB success");
        callback(null,data);
      }
    });
};
