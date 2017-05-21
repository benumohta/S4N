(function () {

    function loginController ($scope,loginProvider) {
      $scope.page_load_error = null;
      $scope.finished_loading =  true;
      $scope.loggedIn = false;
      $scope.loggedOut = false;

      $scope.isUserLoggedIn = function(){
      if ($scope.userdata){
        $scope.finished_loading =  true;
        $scope.loggedIn = true;
      }
    };

      $scope.login = function(){
        $scope.page_load_error = false;
        $scope.finished_loading =  false;
        $scope.loggedIn = false;
        $scope.loggedOut = false;
        loginProvider.loginUser($scope.user,(err,result)=>{
          if(err){
            $scope.page_load_error = true;
            $scope.finished_loading =  true;
            $scope.failuremessage = err.message;
          }else{
            $scope.finished_loading =  true;
            $scope.loggedIn = true;
            $scope.successmessage = result.message;
            $scope.userdata = result.userdata;
          }
        });
      };

      $scope.logout = function(user){
        $scope.user = {};
        $scope.userdata = {};
        loginProvider.logoutUser(user,(err,result)=>{
          if(err){
            $scope.page_load_error = true;
            $scope.finished_loading =  true;
            $scope.loggedIn = false;
            $scope.loggedOut = false;
          }else{
            $scope.page_load_error = false;
            $scope.finished_loading =  true;
            $scope.loggedIn = false;
            $scope.loggedOut = true;
            $scope.successmessage =  "User logged out successfully";
          }
        });
      };
    }
    S4NApp.controller("loginController", ['$scope','loginProvider',loginController]);
})();
