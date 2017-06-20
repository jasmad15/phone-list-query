(function () {
    'use strict';
  	$("#btnOk").hide();
	$("#btnCancel").hide();
    angular
        .module('app')
        .controller('Account.IndexController', Controller);

    function Controller($window, UserService, FlashService) {
        var vm = this;
        
        vm.filterField = "superiorUser";
        vm.agencias = null;
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
        vm.updateUser = updateUser;
        vm.clearFlash = clearFlash;
        vm.getListAgencies = getListAgencies;
        vm.prepareInsert = prepareInsert;
        vm.action = null;
        vm.clearForm = clearForm;
        vm.prepareUpdate = prepareUpdate;
        initController();

        function initController() {
            
            UserService.GetCurrent().then(function (user) {
                vm.currentUser = user;
                $("#lbUserName").text(vm.currentUser.username);
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
            //Cargamos las agencias
            getListAgencies();
        }

        function prepareInsert()
        {
        	//Primero limpiamos le formulario
        	emtyFields();
        	//ocultamos los botones de buscar y nuevo
        	$("#btnSearch").hide();
        	$("#btnPlus").hide();
        	//Mostramos los otros botones
        	$("#btnOk").show();
        	$("#btnCancel").show();
        	vm.action = 0;
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
        
        function updateUser()
        {
        	if (vm.action = 0)
        	{
        		createUser();
        	}else
        	{
        		saveUser();
        	}
        }
        
        
        function getListAgencies()
        {
        	  UserService.getListAgencies()
              .then(function (agencias) {
              	if (agencias.length > 0) {
              		//Proceso de carga de la lista
              		vm.agencias = agencias;
              	} else {
              		FlashService.Error('No hay agencias definidas');
              	}
              })
              .catch(function (error) {
                  FlashService.Error(error);
              });        	
        }
        function clearFlash()
        {
        	FlashService.clearFlash();
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
        		if (vm.user == null)
        		{
        			vm.user = new Object();
        		}
        		vm.user.agencia = vm.currentUser.agencia;
        		vm.user.profile = 3;
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
        	if (vm.user != null)
        	{
	    		delete vm.user.firstName;
	    		delete  vm.user.lastName;
	    		delete vm.user.superiorUser;
	    		delete vm.user.password;
	    		delete vm.user.agencia;
        	}
        }
        
        function clearForm()
        {
        	//Primero limpiamos le formulario
        	emtyFields();
        	//Mostramos los botones de buscar y nuevo
        	$("#btnSearch").show();
        	$("#btnPlus").show();
        	//Ocultamos los otros botones
        	$("#btnOk").hide();
        	$("#btnCancel").hide();
        	delete vm.action;
        	
        }
        
        function prepareUpdate()
        {
        	
        }
    }

})();