(function () {
    'use strict';

    angular
        .module('app', ['ui.router'])
        .config(config)
        .run(run)
        .factory('authHttpResponseInterceptor',['$q','$location','$window', function($q,$location,$window){
	return {
		response: function(response){
			if (response.status === 401) {
				console.log("Response 401");
			}
			return response || $q.when(response);
		},
		responseError: function(rejection) {
			if (rejection.status === 401) {
				console.log("Response Error 401",rejection);
				$window.location.href = '/login';
			}
			//return $q.reject(rejection);
		}
	}
}]);

    function config($stateProvider, $urlRouterProvider, $httpProvider) {
        // default route
        $urlRouterProvider.otherwise("/");
        $httpProvider.interceptors.push('authHttpResponseInterceptor');
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'home/index.html',
                controller: 'Home.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'home' }
            })
            .state('account', {
                url: '/account',
                templateUrl: 'account/index.html',
                controller: 'Account.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'account' }
            })
            .state('logging', {
                url: '/logging',
                templateUrl: 'logging/index.html',
                controller: 'Logging.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'logging' }
            });
        
        
       
      
    }

    function run($http, $rootScope, $window) {
        // add JWT token as default auth header
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

        // update active tab on state change
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.activeTab = toState.data.activeTab;
        });
    }

    // manually bootstrap angular after the JWT token is retrieved from the server
    $(function () {
        // get JWT token from server
        $.get('/app/token', function (token) {
            window.jwtToken = token;

            angular.bootstrap(document, ['app']);
        });
    });
})();