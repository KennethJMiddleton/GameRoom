var gameRoom = angular.module('gameRoom', ['ngRoute', 'ngResource', 'angular-jwt']);

gameRoom.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'pages/landing.html',
            controller: 'landingController'
        })
        .when('/security', {
            templateUrl: 'pages/security.html',
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

gameRoom.config(function Config($httpProvider, jwtOptionsProvider){
    jwtOptionsProvider.config({
        tokenGetter: ['credService', function(credService) {
          return credService.token;
        }]
    })
    $httpProvider.interceptors.push('jwtInterceptor');
});



gameRoom.controller('landingController', ['$scope', function($scope){

}]);

gameRoom.controller('loginController', ['$scope', '$location', '$resource','jwtHelper', 'credService', function($scope, $location, $resource, jwtHelper, credService){    
    $scope.submitLogin = function() {

        $scope.loginError = '';
        $scope.callLoginAPI = $resource('/auth/login');
        var login = new $scope.callLoginAPI({'username': $scope.username, 'password': $scope.password})
        login.$save(function (response) {
            credService.token = response.authToken;
            if (!jwtHelper.isTokenExpired(credService.token)){
                $location.path('/home');
            };
        }, function (error) {
            if(error.data == 'Unauthorized'){
                $scope.loginError = 'That username and password combination are not in our system. Please try again.'
            }
            else{
                $scope.loginError = 'Something went wrong! Make sure you typed something in both fields. If you did, please reload the page and try again.'
            };
        })
    };
}]);

gameRoom.controller('newAccountController', ['$scope', function($scope){

}]);

gameRoom.controller('homeController', ['$scope','$location', 'jwtHelper', 'credService', function($scope,$location,jwtHelper,credService){
    if(jwtHelper.isTokenExpired(credService.token)){
        $location.path('/security');
    }

}]);

gameRoom.controller('myGamesController', ['$scope', '$location', '$resource', 'jwtHelper', 'credService', function($scope, $location, $resource, jwtHelper, credService){
    if(jwtHelper.isTokenExpired(credService.token)){
        $location.path('/security');
    }
    $scope.emptyRoom = false;
    var payload = jwtHelper.decodeToken(credService.token);
    $scope.getGames = $resource('/gameshelf/' + payload.user.myShelf);
    $scope.getGames.query(function(games){
        if (games.length === 0){
            $scope.emptyRoom = true;
        }
        else {
            $scope.gamelist = Object.values(games);
            $scope.gamelist.splice(-2,2);
            for(var game, i=0; game=$scope.gamelist[i++];){
                var qualityArray = [];
                if(game.bluffing === true ){
                    qualityArray.push("/icons/bluffing.png");
                }
                if(game.coop === true ){
                    qualityArray.push("/icons/cooperative.png");
                }
                if(game.deckBuilding === true ){
                    qualityArray.push("/icons/deck_building.png");
                }
                if(game.dice === true ){
                    qualityArray.push("/icons/dice.png");
                }
                if(game.party === true ){
                    qualityArray.push("/icons/party.png");
                }
                if(game.setCollecting === true ){
                    qualityArray.push("/icons/set_collecting.png");
                }
                if(game.tokenMovement === true ){
                    qualityArray.push("/icons/token_movement.png");
                }
                if(game.tokenPlacement === true ){
                    qualityArray.push("/icons/token_placement.png");
                }
                if(game.trivia === true ){
                    qualityArray.push("/icons/trivia.png");
                }
                if(game.expansion === true ){
                    qualityArray.push("/icons/expansion.png");
                }
                game.qualities = qualityArray;
            }
            $scope.gamesPerPage = 3;
            $scope.currentPage = 1;
            $scope.searchText = "";
            $scope.filteredGames = $scope.gamelist;
            $scope.gameNameSearch = "";
            $scope.gameNumSearch = "";
            console.log($scope.gamelist);

            $scope.newPage = function(page){
                console.log(page, 'newpage')
                $scope.currentPage = page;
                var start = (($scope.gamesPerPage*$scope.currentPage)-$scope.gamesPerPage);
                var end = start+parseInt($scope.gamesPerPage);
                $scope.filteredGames = $scope.gamelist.slice(start,end); 
            }

            $scope.getNumber = function(num){
                return new Array(num);
            }

            $scope.$watch('gamesPerPage',function(newValue,oldValue){
                if(newValue!==oldValue){
                    $scope.currentPage = 1;
                    $scope.numberOfPages = Math.ceil($scope.filteredGames.length/$scope.gamesPerPage);
                    $scope.newPage(1);
                    console.log(newValue, oldValue, 'something');
                }
            });

            $scope.$watch('gameNameSearch',function(newValue,oldValue){
                if(newValue || newValue==''){
                    var items = [];
                    for (var item, i = 0; item = $scope.gamelist[i++];){
                        var name = item.name.toLowerCase();
                        var search = newValue.toLowerCase();
                        if(name.indexOf(search) != -1){
                            items.push(item);
                        }
                    }
                    $scope.filteredContacts = items;
                    $scope.currentPage = 1;
                    $scope.selectedState = "";
                    $scope.numberOfPages = Math.ceil($scope.filteredGames.length/$scope.gamesPerPage);	
                }
            });

            
        } 
    },function(error){
        console.log(error);
    });
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