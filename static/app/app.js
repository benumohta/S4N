var S4NApp = angular.module("S4N", ["ngRoute"]);

S4NApp.config(function ($routeProvider) {
  $routeProvider
      .when("/loginapp",{controller:"loginController",
                           templateUrl:"app/partials/login.html"})
      .when("/404",{controller:"404Controller",
                           templateUrl:"app/partials/404.html"})
      .when("/",{redirectTo:"/loginapp"})
      .otherwise({redirectTo:"/404_page"})
});
