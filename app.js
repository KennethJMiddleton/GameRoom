var gameRoom = angular.module('gameRoom', ['ngRoute', 'ngResource', 'angular-jwt']);

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

gameRoom.service('credService', function() {
    this.token='empty';
});

gameRoom.controller('landingController', ['$scope', function($scope){

}]);

gameRoom.controller('loginController', ['$scope', '$location', '$resource','jwtHelper', 'credService', function($scope, $location, $resource, jwtHelper, credService){    
    $scope.submitLogin = function() {

        $scope.loginError = '';
        $scope.callLoginAPI = $resource('/auth/login');
        var login = new $scope.callLoginAPI({'username': $scope.username, 'password': $scope.password})
        login.$save(function (response) {
            console.log(response);
            credService.token = response.authToken;
            console.log(credService.token);
            console.log(jwtHelper.isTokenExpired(credService.token));
            if (!jwtHelper.isTokenExpired(credService.token)){
                $location.path('/home');
            };
        }, function (error) {
            console.log(error);
            if(error.data == 'Unauthorized'){
                $scope.loginError = 'That username and password combination are not in our system. Please try again.'
            };
        })
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