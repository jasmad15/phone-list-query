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
            });
        }
        
        function findNumber() {
             PhoneListService.findNumber(vm.listin)
                .then(function (data) {
                    FlashService.Success(data.TIPO);
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
                
        }
    }

})();