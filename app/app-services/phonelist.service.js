(function () {
    'use strict';

    angular
        .module('app')
        .factory('PhoneListService', Service);

    function Service($http, $q) {
        var service = {};
       
        service.findNumber = findNumber;

        return service;


        function findNumber(data) {
            return $http.post('/api/users/findNumber', data).then(handleSuccess, handleError);
        }


        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();
