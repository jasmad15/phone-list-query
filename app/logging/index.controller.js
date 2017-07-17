
(function () {
    'use strict';

    angular
        .module('app')
        .controller('Logging.IndexController', Controller);

    function Controller(UserService, FlashService, LoggerService) {
        var vm = this;
        vm.log = null;
        
        vm.getLogging = getLogging;
        vm.getCSVLog = getCSVLog;
       
        
        function getLogging() {
       	 
       		LoggerService.getLogging(vm.log)
                .then(function (data) {
                	//Mostramos los resultados
                	console.log(data);
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });        		 
       }
        
        function getCSVLog() {
       
        	LoggerService.getCSVLog(vm.log)
                .then(function (data) {
                	//Descarga
                	window.open(data);
                	console.log(data);

                })
                .catch(function (error) {
                    FlashService.Error(error);
                });        		 
       
       }
    }

})();