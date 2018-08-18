var gameRoom = angular.module('gameRoom', ['ngRoute', 'ngResource', 'angular-jwt', 'ui.bootstrap']);

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
        .when('/review', {
            templateUrl: 'pages/review.html',
            controller: 'reviewController'
        })
     
});

gameRoom.service('credService', function() {
    this.token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiTi9BIiwidXNlcm5hbWUiOiJOL0EiLCJmaXJzdE5hbWUiOiIiLCJsYXN0TmFtZSI6IiIsIm15U2hlbGYiOiJOL0EiLCJmcmllbmRzU2hlbGZzIjpbIiJdfSwiaWF0IjoxMjI5NTM4MDk0LCJleHAiOjEyMjk1NDI2OTQsInN1YiI6Ik4vQSJ9.v13oZp6eZak4qN-6PGlHjWC1J0NLGZ9YnN07-Rdd_vM';
});

gameRoom.service('gameHolder', function(){
    this.game={};
});

gameRoom.config(function Config($httpProvider, jwtOptionsProvider){
    jwtOptionsProvider.config({
        tokenGetter: ['credService', function(credService) {
          return credService.token;
        }]
    })
    $httpProvider.interceptors.push('jwtInterceptor');
});

gameRoom.filter('playerRange', function(){
    return function(input, target){
    var output=[];
    angular.forEach(input, function(game){
        if(target === null||target ===''){
            output=input;
        }else if(game.minPlayers <= target && target <= game.maxPlayers){
            output.push(game); 
        };
    });     
    return output;
    }
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

gameRoom.controller('newAccountController', ['$scope', '$location', '$resource','jwtHelper', 'credService', function($scope, $location, $resource, jwtHelper, credService){
    $scope.submitCreate = function() {
        $scope.createError ="";
        if($scope.passwordCreate === $scope.passwordConfirm){
            var user = {
                "username" : $scope.userCreate,
                "password" : $scope.passwordCreate
            };
            $scope.callCreateAPI = $resource('/users/');
            var create = new $scope.callCreateAPI(user);
            create.$save(function (response) {
                if(response.username===user.username){
                    $scope.callLoginAPI = $resource('/auth/login');
                    var login = new $scope.callLoginAPI({'username': user.username, 'password': user.password})
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
                }
            }, function (error) {
               $scope.createError = error.data.message;
            });
        }else{
            $scope.createError = 'Your passwords do no match. Please try again.'
        };
    };
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
            console.log($scope.gamelist);
            $scope.gamesPerPage = 6;
            $scope.filteredGames = $scope.gamelist;
            $scope.gameNameSearch = '';
            $scope.gameNumSearch = null;
            $scope.totalItems = $scope.filteredGames.length;
            $scope.currentPage = 1;

            $scope.setPage = function (pageNo) {
                $scope.currentPage = pageNo;
            };

            $scope.pageChanged = function() {
                $log.log('Page changed to: ' + $scope.currentPage);
            };

            $scope.maxSize = $scope.gamesPerPage;
            $scope.bigTotalItems = $scope.filteredGames.length;
            $scope.bigCurrentPage = 1;

            $scope.$watch('gamesPerPage',function(newValue,oldValue){
                if(newValue!==oldValue){
                    //$scope.currentPage = 1;
                    $scope.numberOfPages = Math.ceil($scope.gamelist.length/$scope.gamesPerPage);
                    //$scope.newPage(1);
                }
            });

            $scope.$watch('gameNameSearch',function(newValue,oldValue){
                if(newValue || newValue==''){
                    $scope.numberOfPages = Math.ceil($scope.filteredGames.length/$scope.gamesPerPage);	
                }
            });

            $scope.$watch('gameNumSearch',function(newValue,oldValue){
                if(newValue || newValue==''){
                    $scope.numberOfPages = Math.ceil($scope.filteredGames.length/$scope.gamesPerPage);	
                }
            });
            
        } 
    },function(error){
        console.log(error);
    });
}]);

gameRoom.controller('searchController', ['$scope', '$location', '$resource', 'jwtHelper', 'credService', function($scope, $location, $resource, jwtHelper, credService){
    if(jwtHelper.isTokenExpired(credService.token)){
        $location.path('/security');
    }
    //var payload = jwtHelper.decodeToken(credService.token);
    $scope.getGamesMaster = $resource('/games');
    $scope.getGamesMaster.query(function(master){
        console.log(master);
        $scope.gamelist = Object.values(master);
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
        $scope.gamesPerPage = 6;
        $scope.filteredGames = $scope.gamelist;
        $scope.gameNameSearch = '';
        $scope.gameNumSearch = null;
        $scope.totalItems = $scope.filteredGames.length;
        $scope.currentPage = 1;
        

        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.pageChanged = function() {
            $log.log('Page changed to: ' + $scope.currentPage);
        };

        $scope.maxSize = $scope.gamesPerPage;
        $scope.bigTotalItems = $scope.filteredGames.length;
        $scope.bigCurrentPage = 1;

        $scope.$watch('gamesPerPage',function(newValue,oldValue){
            if(newValue!==oldValue){
                $scope.currentPage = 1;
                $scope.numberOfPages = Math.ceil($scope.gamelist.length/$scope.gamesPerPage);
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

        $scope.shelveGame= function (id) {
            console.log(id);
            var tokenPayload = jwtHelper.decodeToken(credService.token);
            console.log(tokenPayload);
            $scope.addToShelf = $resource('/gameshelf/'+tokenPayload.user.myShelf+'/'+id, {}, {update: {method: 'PUT'}});
            $scope.addToShelf.update();
            
        };
    },function(error){
        console.log(error);
    });
}]);

gameRoom.controller('logoutController', ['$scope','$location', 'jwtHelper', 'credService', function($scope,$location,jwtHelper,credService){
    if(jwtHelper.isTokenExpired(credService.token)){
        $location.path('/security');
    }
    $scope.submitLogout = function() {
        credService.token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiTi9BIiwidXNlcm5hbWUiOiJOL0EiLCJmaXJzdE5hbWUiOiIiLCJsYXN0TmFtZSI6IiIsIm15U2hlbGYiOiJOL0EiLCJmcmllbmRzU2hlbGZzIjpbIiJdfSwiaWF0IjoxMjI5NTM4MDk0LCJleHAiOjEyMjk1NDI2OTQsInN1YiI6Ik4vQSJ9.v13oZp6eZak4qN-6PGlHjWC1J0NLGZ9YnN07-Rdd_vM';
        $location.path('/');
    };
}]);

gameRoom.controller('newGameController', ['$scope','$location', 'jwtHelper', 'credService', 'gameHolder', function($scope,$location,jwtHelper,credService,gameHolder){
    if(jwtHelper.isTokenExpired(credService.token)){
        $location.path('/security');
    }
    $scope.submitAdd = function() {
        gameHolder.game = {
            name: $scope.name,
            minPlayers: $scope.minPlayers,
            maxPlayers: $scope.maxPlayers,
            time: $scope.time,
            age: $scope.age,
            coop: $scope.coop,
            dice: $scope.dice,
            deckBuilding: $scope.deckBuilding,
            bluffing: $scope.bluffing,
            tokenMovement: $scope.tokenMovement,
            tokenPlacement: $scope.tokenPlacement,
            setCollecting: $scope.setCollecting,
            party: $scope.party,
            trivia: $scope.trivia,
            expansion: $scope.expansion
        };
        $location.path('/review');
    }
}]);

gameRoom.controller('securityController', ['$scope', function($scope){

}]);

gameRoom.controller('reviewController', ['$scope','$location', '$resource', 'jwtHelper', 'credService', 'gameHolder', function($scope,$location,$resource,jwtHelper,credService,gameHolder){
    if(jwtHelper.isTokenExpired(credService.token)){
        $location.path('/security');
    }
    $scope.game = gameHolder.game;
    var qualityArray = [];
    if($scope.game.bluffing === 'true' ){
        qualityArray.push("/icons/bluffing.png");
    }
    if($scope.game.coop === 'true' ){
        qualityArray.push("/icons/cooperative.png");
    }
    if($scope.game.deckBuilding === 'true' ){
        qualityArray.push("/icons/deck_building.png");
    }
    if($scope.game.dice === 'true' ){
        qualityArray.push("/icons/dice.png");
    }
    if($scope.game.party === 'true' ){
        qualityArray.push("/icons/party.png");
    }
    if($scope.game.setCollecting === 'true' ){
        qualityArray.push("/icons/set_collecting.png");
    }
    if($scope.game.tokenMovement === 'true' ){
        qualityArray.push("/icons/token_movement.png");
    }
    if($scope.game.tokenPlacement === 'true' ){
        qualityArray.push("/icons/token_placement.png");
    }
    if($scope.game.trivia === 'true' ){
        qualityArray.push("/icons/trivia.png");
    }
    if($scope.game.expansion === 'true' ){
        qualityArray.push("/icons/expansion.png");
    }
    $scope.game.qualities = qualityArray;
    $scope.submitGame = function(game){
        $scope.callGameAPI = $resource('/games/');
        var newGame = new $scope.callGameAPI(game);
        newGame.$save(function (response) {
            $location.path('/search');
        }, function (error) {
            console.log(error);
        });
    };

}]);