var
dbconfig= require('./db.js');


var users = [];
var user;
/*var users= {
  "id123":{id: 123 , username: "test1" , password: "cat"},
  "id1": {id: 1, username: "admin", password: "admin"}
};*/

exports.insertdb = function(users, callback){
    dbconfig.UserCol.insertOne(users,function(err,results){
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


exports.findUser = function(username,callback){
    dbconfig.UserCol.find({username:username}).toArray((err,data)=>{
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
exports.user = null;
