var gameRoom = angular.module('gameRoom', ['ngRoute', 'ngResource']);

gameRoom.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'pages/landing.html',
            controller: 'landingController'
        })
        .when('/login', {
            templateUrl: 'pages/login.html',
            controller: 'loginController'
        })
        .when('/newAccount', {
            templateUrl: 'pages/newAccount.html',
            controller: 'newAccountController'
        })
        .when('/home', {
            templateUrl: 'pages/home.html',
            controller: 'homeController'
        })
        .when('/myGames', {
            templateUrl: 'pages/myGames.html',
            controller: 'myGamesController'
        })
        .when('/search', {
            templateUrl: 'pages/search.html',
            controller: 'searchController'
        })
        .when('/logout', {
            templateUrl: 'pages/logout.html',
            controller: 'logoutController'
        })
        .when('/newGame', {
            templateUrl: 'pages/newGame.html',
            controller: 'newGameController'
        })
});

gameRoom.controller('landingController', ['$scope', function($scope){

}]);

gameRoom.controller('loginController', ['$scope', '$location', '$resource', function($scope, $location, $resource){    
    $scope.submitLogin = function() {

        $scope.callLoginAPI = $resource('/auth/login',{},{create: {method: "POST"}});

        console.log('username: '+$scope.username);
        console.log('password: '+$scope.password);
        console.log($scope.callLoginAPI);
        $scope.credentials = $scope.callLoginAPI.create({'username': $scope.username, 'password': $scope.password});

        console.log($scope.credentials);

        //$location.path('/home');
    };
}]);

gameRoom.controller('newAccountController', ['$scope', function($scope){

}]);

gameRoom.controller('homeController', ['$scope', function($scope){

}]);

gameRoom.controller('myGamesController', ['$scope', function($scope){

}]);

gameRoom.controller('searchController', ['$scope', function($scope){

}]);

gameRoom.controller('logoutController', ['$scope', function($scope){

}]);

gameRoom.controller('newGameController', ['$scope', function($scope){

}]);