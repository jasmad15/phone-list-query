(function () {
    'use strict';

    angular
        .module('app')
        .controller('Account.IndexController', Controller);

    function Controller($window, UserService, FlashService) {
        var vm = this;
        
        vm.filterField = "superiorUser";
        vm.agencia = null;
        var objFilter = null;
        vm.user = null;
        vm.currentUser = null;
        vm.saveUser = saveUser;
        vm.deleteUser = deleteUser;
        vm.createUser = createUser;
        vm.findUser = findUser;
        vm.findListUsers = findListUsers;
        vm.userList = null;


        initController();

        function initController() {
            
            UserService.GetCurrent().then(function (user) {
                vm.currentUser = user;
                //$("#loginUser").text(vm.currentUser.username);
            	//Con poner aqui el nombre de la agencia el funcionamiento sera igual
                vm.agencia = vm.currentUser.username;
                if (vm.currentUser.profile != 1)
                {
                	$("#superiorUser").remove();
                	$("#agencia").remove();
                	objFilter = JSON.parse('{\"' + vm.filterField + '\":\"' + vm.agencia + '\"}');
                	findListUsers();
                	
                }
            });
            
        }

        function saveUser() {        	
            UserService.Update(vm.user)
                .then(function () {
                    FlashService.Success('Usuario Actualizado');
                    emtyFields();
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
                    findListUsers();
                    emtyFields();
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        function deleteUser(idUser) {
        	//UserService.Delete(vm.id)
            UserService.Delete(idUser)
                .then(function () {
                	FlashService.Success('Usuario borrado con exito');
                	findListUsers();
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }
        
        function findListUsers(){        
        	// Si es supervisor añadimos el filtro de la agencia
        	if (vm.currentUser.profile == 2)
        	{
        		vm.user.agencia = vm.currentUser.agencia;
        		//no se si tenemos que añadir tambíen el usuario creador,
        		// es decir, si un supervisor puede ver solo los usuarios creados por é y su agencia
        	}
            UserService.GetByFilter(vm.user)
            .then(function (user) {
            	if (user.length > 0) {
            		//Proceso de carga de la lista
            		vm.userList = user;
            	} else {
            		FlashService.Error('Agencia sin usuarios');
            	}
            })
            .catch(function (error) {
                FlashService.Error(error);
            });        	
        	
        }
        
        function findUser() {
        	//Esto en teoria no deberia ser necesario
        	delete vm.user.lastName;
        	delete vm.user.firstName;
        	
            UserService.GetByFilter(vm.user)
                .then(function (user) {
            		//vm.user.firstName = user[0].firstName;
            		//vm.user.superiorUser = user[0].superiorUser;
            		vm.userList = user;
            		emtyFields();
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
    		vm.user.agencia = '';
        }
        
    }

})();