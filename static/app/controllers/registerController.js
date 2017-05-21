(function () {

    function registerController ($scope,$window,registerProvider) {

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


    }
    S4NApp.controller("registerController", ['$scope','$window','registerProvider',registerController]);
})();
