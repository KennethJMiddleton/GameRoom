var gameRoom = angular.module('gameRoom', ['ngRoute', 'ngResource', 'angular-jwt']);

gameRoom.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'pages/landing.html',
            controller: 'landingController'
        })
        .when('/security', {
            templateURL: 'pages/security.html',
            controller: 'securityController'
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
    this.token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiTi9BIiwidXNlcm5hbWUiOiJOL0EiLCJmaXJzdE5hbWUiOiIiLCJsYXN0TmFtZSI6IiIsIm15U2hlbGYiOiJOL0EiLCJmcmllbmRzU2hlbGZzIjpbIiJdfSwiaWF0IjoxMjI5NTM4MDk0LCJleHAiOjEyMjk1NDI2OTQsInN1YiI6Ik4vQSJ9.v13oZp6eZak4qN-6PGlHjWC1J0NLGZ9YnN07-Rdd_vM';
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

gameRoom.controller('homeController', ['$scope','$location', 'jwtHelper', 'credService', function($scope,$location,jwtHelper,credService){
    /*if(jwtHelper.isTokenExpired(credService.token)){
        console.log('it works!')
        $location.path('/security');
    }*/

}]);

gameRoom.controller('myGamesController', ['$scope', function($scope){

}]);

gameRoom.controller('searchController', ['$scope', function($scope){

}]);

gameRoom.controller('logoutController', ['$scope', '$location', 'credService', function($scope, $location, credService){
    $scope.submitLogout = function() {
        credService.token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiTi9BIiwidXNlcm5hbWUiOiJOL0EiLCJmaXJzdE5hbWUiOiIiLCJsYXN0TmFtZSI6IiIsIm15U2hlbGYiOiJOL0EiLCJmcmllbmRzU2hlbGZzIjpbIiJdfSwiaWF0IjoxMjI5NTM4MDk0LCJleHAiOjEyMjk1NDI2OTQsInN1YiI6Ik4vQSJ9.v13oZp6eZak4qN-6PGlHjWC1J0NLGZ9YnN07-Rdd_vM';
        console.log('go away')
        $location.path('/');
    };
}]);

gameRoom.controller('newGameController', ['$scope', function($scope){

}]);
gameRoom.controller('securityController', ['$scope', function($scope){

}]);