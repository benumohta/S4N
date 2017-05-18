(function () {

    function loginController ($scope,loginProvider) {
      $scope.page_load_error = null;
      $scope.finished_loading =  true;
      $scope.loggedIn = false;

      $scope.login = function(user){
        $scope.page_load_error = false;
        $scope.finished_loading =  false;
        $scope.loggedIn = false;
        loginProvider.loginUser(user,(err,result)=>{
          if(err){
            $scope.page_load_error = true;
            //console.log("Inside Err");
          //  console.log(err);
            $scope.finished_loading =  true;
            $scope.failuremessage = err.message;
          }else{
            $scope.finished_loading =  true;
            $scope.loggedIn = true;
            //console.log(result.message);
            $scope.successmessage = result.message;
            $scope.UserId   = result.userdata.id;
            $scope.username = result.userdata.username;
            $scope.password = result.userdata.password;
          }
        });
      };

    }
    S4NApp.controller("loginController", ['$scope','loginProvider',loginController]);
})();
