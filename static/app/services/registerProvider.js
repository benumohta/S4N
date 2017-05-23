(function(){
  function registerProvider($http){

  this._server_host = "";
  this.regsiterUser = function(user,callback){
    $http.put(this._server_host+"/users",user)
    .success(function (data, status, headers, conf) {
        callback(null, data);
    })
    .error(function (data, status, headers, conf) {
        callback(data,null);
    });
  };

  this.validateUser = function(user,callback){
    $http.post(this._server_host+"/validateUser",user)
    .success(function (data, status, headers, conf) {
        callback(null, data);
    })
    .error(function (data, status, headers, conf) {
        callback(data,null);
    });
  };

  }
  S4NApp.service("registerProvider",["$http", registerProvider]);
})();
