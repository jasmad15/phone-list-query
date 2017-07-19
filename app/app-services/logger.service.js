(function () {
    'use strict';

    angular
        .module('app')
        .factory('LoggerService', Service);

    function Service($http, $q) {
        var service = {};
       
        service.getLogging = getLogging;
        
        service.getCSVLog = getCSVLog;

        return service;


        function getLogging(data) {
            return $http.post('/api/users/findNumber', data).then(handleSuccess, handleError);
        }
        
        function getCSVLog(data) {
            return $http.post('/api/users/getCSVLog', data).then(handleSuccess, handleError);
        }
        
        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();