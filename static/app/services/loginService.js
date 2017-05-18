(function(){
  function loginProvider($http){

  this._server_host = "";

  this.loginUser = function(user,callback){
    $http.post(this._server_host+"/login",user)
    .success(function (data, status, headers, conf) {
        callback(null, data);
    })
    .error(function (data, status, headers, conf) {
        callback(data,null);
    });
  };

  this.logoutUser = function(user,callback){
    $http.get(this._server_host+"/service/logout",user)
    .success(function (data, status, headers, conf) {
        callback(null, data);
    })
    .error(function (data, status, headers, conf) {
        callback(data,null);
    });
  };

}
  S4NApp.service("loginProvider",["$http", loginProvider]);

})();
