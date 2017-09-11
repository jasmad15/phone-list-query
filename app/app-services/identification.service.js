(function () {
    'use strict';

    angular
        .module('app')
        .factory('IdentificationService', Service);

    function Service($http, $q) {
        var service = {};
       
        service.findId = findId;

        return service;


        function findId(data) {
            return $http.post('/api/users/findId', data).then(handleSuccess, handleError);
        }


        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();
