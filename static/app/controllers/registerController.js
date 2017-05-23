(function () {
    function registerController ($scope,$window,registerProvider) {
      $scope.UserAlreadyExists = false;
      $scope.UserGo = false;
      $scope.emailCSS = "form-group has-feedback";
      $scope.submit = function(){
        registerProvider.regsiterUser($scope.user,(err,results)=>{
          if(err){
            alert(err.message);
          }
          else{
            var host = $window.location.host;
            var landingUrl = "http://" + host + "/#";
            alert(landingUrl);
            $window.location.href = landingUrl;
          }
        });
      }

      $scope.UserExists = function(){
        $scope.UserAlreadyExists = false;
        $scope.UserGo = false;
        registerProvider.validateUser($scope.user,(err,results)=>{
          if(err){
            $scope.UserAlreadyExists = true;
            $scope.failuremessage = err.message;
            $scope.emailCSS = "form-group has-error has-feedback";
          }else{
            $scope.UserGo = true;
            $scope.emailCSS = "form-group has-success has-feedback";
          }
        });
      }

    }
    S4NApp.controller("registerController", ['$scope','$window','registerProvider',registerController]);
})();
