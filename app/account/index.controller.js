﻿(function () {
    'use strict';

    angular
        .module('app')
        .controller('Account.IndexController', Controller);

    function Controller($window, UserService, FlashService) {
        var vm = this;

        vm.user = null;
        vm.currentUser = null;
        vm.saveUser = saveUser;
        vm.deleteUser = deleteUser;
        vm.createUser = createUser;
        vm.findUser = findUser;
        vm.userList = null;


        initController();

        function initController() {
            
            UserService.GetCurrent().then(function (user) {
                vm.currentUser = user;
            });
            
        }

        function saveUser() {        	
            UserService.Update(vm.user)
                .then(function () {
                    FlashService.Success('Usuario Actualizado');                	
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }
        
        function createUser() {
        	vm.user.superiorUser = vm.currentUser.username;
            UserService.Create(vm.user)
                .then(function () {
                    FlashService.Success('Usuario creado correctamente');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        function deleteUser() {
            UserService.Delete(vm.id)
                .then(function () {
                	FlashService.Success('Usuario borrado con exito');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }
        
        function findListUsers(){
        	vm.user.superiorUser = vm.currentUser.username;
        	delete vm.user.lastName;
        	delete vm.user.firstName;
        	delete vm.user.lastName;
        	delete vm.user.password;
        	
            UserService.GetByFilter(vm.user)
            .then(function (user) {
            	if (user.length > 0) {
            		//Proceso de carga de la lista
            		vm.userList = user;
            	} else {
            		FlashService.Error('Usuario no localizado');
            		emtyFields();
            	}
            })
            .catch(function (error) {
                FlashService.Error(error);
            });        	
        	
        }
        
        function findUser() {
        	//Esto en teoria no deberia ser necesario
        	//delete vm.user.lastName;
        	//delete vm.user.firstName;
        	
            UserService.GetByFilter(vm.user)
                .then(function (user) {
                    //FlashService.Success('Usuario Actualizado');
            		vm.user.firstName = user[0].firstName;
            		vm.user.superiorUser = user[0].superiorUser;
            		vm.userList = user;                	
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }
        
        function emtyFields(){
    		vm.user.firstName = '';
    		vm.user.lastName = '';
    		vm.user.superiorUser = '';
    		vm.user.password = '';       	
        }
        
    }

})();