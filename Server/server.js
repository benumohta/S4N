var express = require('express'),
morgan = require('morgan'),
bodyParser = require('body-parser')
cookieParser  = require('cookie-parser')
session = require('express-session'),
passport = require('passport'),
passportLocal = require('passport-local').Strategy,
flash = require('express-flash'),
dbHandler= require('./InsertDB.js'),
lib=require('./library.js'),
dbconfig= require('./db.js');



var app = express();
app.use(require("morgan")("dev"));
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname+"/../static"));

app.use(session({
  secret: "Ha Ha Ha",
  resave: false,
  saveUninitialized: true,
  cookie: {secure: false},
}));
app.use(cookieParser("Ha Ha Ha"));
app.use(passport.initialize());
app.use(passport.session());


// var userCol = dbconfig.UserCol;
var MasterUser ={};

/*var users= {
  "id123":{id: 123 , username: "test1" , password: "cat"},
  "id1": {id: 1, username: "admin", password: "admin"}
};*/
//validate incoming request

passport.use(new passportLocal(function(username, password, done){
  dbHandler.findUser(username,(err, results)=>{
     if (err){
      // console.log("Inside err");
      // console.log(err);
      return done (null, false,{message: "DB error"});
    }else {
      // console.log("Inside Success");
      // console.log(results);
      if(!results[0]){
        return done (null, false,{message: "User Not found"});
      }else if(results[0].password == password){
        var id = "id"+results[0].id;
        MasterUser =  {[id] : results[0]};
        // console.log(MasterUser);
        return done(null, results[0]);
      }else{
        return done (null, false,{message: "Incorrect Credential"});
      }
    }
  });
}));

//serialize
passport.serializeUser(function(user,done){
  // console.log("Inside Serialize");
  if (MasterUser["id"+user.id]){
    done(null, "id"+user.id);
  }else{
    done(new Error("CANT_SERIALIZE_USER"));
  }
});

//deserialize

passport.deserializeUser(function(userid,done){
  // console.log("Inside DeSerialize");
  if (MasterUser[userid]){
    done(null, MasterUser[userid]);
  }else{
    done(new Error("User_DOESNT_EXIST"));
  }
});



app.post("/login", passport.authenticate('local',{
  successRedirect: '/members',
  failureRedirect: '/login',
  successFlash: {message: "Welcome back"},
  failureFlash: true
}), function(req,res){
  res.cookie(req);
});


app.get("/login", function (req, res) {
    var error = req.flash("error");
    var Message;
    if (error && error.length) {
      Message = {message:error[0]};
    }
      res.writeHead(500, { "Content-Type" : "application/json" });
    res.end(JSON.stringify(Message));
});

app.get('/members',  AuthenticatedOrNot, function(req, res){
     console.log("Inside Members");
  // console.log(req.user);
  var Message = {"userdata":req.user, message:"mebers area only"};
  // console.log(Message);
  res.end(JSON.stringify(Message));
});


app.put("/users", function(req,res){
// console.log(req.body);
dbHandler.insertdb(req.body, function(err,results){
  if (err){
    lib.send_failure(res,500,err);
  }
  else {
    res.writeHead(200, {
      'Content-Type' : 'applicaltion/json',
    });
    res.end(JSON.stringify({Result:"Data Insterted Succcessfully"}));
  }
});

});

app.get("/users", function(req,res){
dbHandler.getUsers(function(err,results){
  if (err){
    lib.send_failure(res,500,err);
  }else {
    lib.send_success(res,dbHandler.users);
  }
});
});

app.post("/user", function(req,res){
  dbHandler.findUser(req.body.username,(err, results)=>{
     if (err){
      // console.log("Inside err");
      // console.log(err);
      lib.send_failure(res,500,err);
    }else {
      // console.log("Inside Success");
      // console.log(results);
      lib.send_success(res,results);
    }
  });
});


function AuthenticatedOrNot(req, res, next){
  if (req.isAuthenticated()){
    next();
  }else{
    res.redirect("/login");
  }
}


dbconfig.initdb(function(err,data){
if(err){
  // console.log(JSON.stringify(err));
}
else {
  app.listen(8080);
}
  });
