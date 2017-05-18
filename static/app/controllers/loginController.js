(function () {

    function loginController ($scope,loginProvider) {
      $scope.page_load_error = null;
      $scope.finished_loading =  true;
      $scope.loggedIn = false;

      $scope.login = function (user){
        $scope.finished_loading =  false;
        loginProvider.loginUser(user,(err,results)=>{
          console.log(err);
          if(err){
            $scope.finished_loading =  true;
          }
          else{
            $scope.finished_loading =  true;
            $scope.loggedIn = true;
          }
        });
      };
}
    S4NApp.controller("loginController", ['$scope','loginProvider',loginController]);
})();
