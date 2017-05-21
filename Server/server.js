var express = require('express'),
    morgan  = require('morgan'),
    bodyParser  = require('body-parser')
    cookieParser  = require('cookie-parser')
    session = require('express-session'),
    passport = require('passport'),
    passportLocal = require('passport-local').Strategy,
    flash = require('express-flash'),
    dbHandler= require('./InsertDB.js'),
    lib=require('./library.js'),
    dbconfig= require('./db.js'),
    bcrypt = require('bcrypt');



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


passport.use(new passportLocal(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  function(username,password, done){
  dbHandler.findUser(username,(err, results)=>{
     if (err){
      return done (null, false,{message: "DB error"});
    }
    else {
      if(!results[0]){
        return done (null, false,{message: "User Not found"});
      }
      else
      {
          bcrypt.compare(password, results[0].password, (err,comresult)=>{
          if(err){
            return done (null, false,{message: "Sign on Failure. Try again Later"});
          }
          else {
            if(comresult){
              return done(null, results[0]);
            }else {
              return done (null, false,{message: "Incorrect Credentials"});
            }
          }
        });
      }
    }
  });
}));
/*
bcrypt.hash(, 10,(err,hash)=>{
  if(err){
    return done (null, false,{message: "Error in hasing password"});
  }
  else {

    if(results[0].password == hash)
    {
      return done(null, results[0]);
    }
    else
    {

    }
  }
});
*/
//serialize
passport.serializeUser(function(user,done){
    done(null, user._id);
});

//deserialize
passport.deserializeUser(function(userid,done){
  dbHandler.findUserById(userid,(err, results)=>{
    if(err){
      done(err,null);
    }else{
      done(null,results[0]);
    }
  });
});



app.post("/login", passport.authenticate('local',{
  successRedirect: '/members',
  failureRedirect: '/login',
  successFlash: {message: "Welcome back"},
  failureFlash: true
})
);

/*app.post("/login",
function(req,res){
  console.log(req.body);
  var Message = {message: "Incorrect Credential"};
  res.writeHead(500, { "Content-Type" : "application/json" });
  res.end(JSON.stringify(Message));
}
);*/


app.get("/login", function (req, res) {
    var error = req.flash("error");
    var Message;
    if (error && error.length) {
      Message = {message:error[0]};
      res.writeHead(500, { "Content-Type" : "application/json" });
    }else{
      res.writeHead(200, { "Content-Type" : "application/json" });
    }
      res.end(JSON.stringify(Message));
});

app.get('/members',  AuthenticatedOrNot, function(req, res){
  var Message = {"userdata":req.user, message:"mebers area only"};
  res.end(JSON.stringify(Message));
});

app.put("/users", function(req,res){
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

app.get("/service/logout", function(req,res){
  if(req.user){
    req.logout();
  }
  res.redirect("/login");
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
      lib.send_failure(res,500,err);
    }else {
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
