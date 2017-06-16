(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller(UserService, PhoneListService, FlashService) {
        var vm = this;

        vm.user = null;
        vm.listin = null;
        vm.findNumber = findNumber;

        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
                //console.log (vm.user);                
            });
        }
        
        function findNumber() {
        	 console.log ('a ' + vm.listin.NVOMSISDN);
             PhoneListService.findNumber(vm.listin)
                .then(function (data) {
                    //FlashService.Success(data.TIPO);
                    resultSearchProcess(data.TIPO, vm.listin.NVOMSISDN);
                    //console.log ('ddd: ' + data.TIPO);
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
                
        }
    }

})();