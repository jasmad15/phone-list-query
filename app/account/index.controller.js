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
        vm.lastUserQuery = null;
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
                //Quitamos la opcion de users
                if (vm.currentUser.profile != 1 && vm.currentUser.profile != 2)
                {
                	$("#userManagement").remove();
                }
                //Quitamos la opcion de trazas
                if (vm.currentUser.profile != 1)
                {
                	$("#loggingManagement").remove();
                }
            });
            //Cargamos las agencias
            getListAgencies();
        }

        function prepareInsert()
        {
        	//Primero limpiamos le formulario
        	emptyFields();
        	//ocultamos los botones de buscar y nuevo
        	showOkCancelButtons();
        	vm.action = 0;
        	
        	
        	
        }
        
        
        function showOkCancelButtons()
        {
        	$("#btnSearch").hide();
        	$("#btnPlus").hide();
        	//Mostramos los otros botones
        	$("#btnOk").show();
        	$("#btnCancel").show();
        }
  
        
        function saveUser() {        	
            UserService.Update(vm.user)
                .then(function () {
                    FlashService.Success('Usuario Actualizado');
                    clearForm();
                    if (vm.lastUserQuery)
                    {
                    	vm.user = vm.lastUserQuery;
                    	findUser();
                    }
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }
        
        function updateUser()
        {
        	if (fieldsControl()) {
	        	if (vm.action == 0)
	        	{
	        		createUser();
	        	}else
	        	{
	        		saveUser();
	        	}
        	}
        }
        
        function fieldsControl(){
        	if (vm.action == 0)
        	{     
        		//usuario nuevo
	        	//if ((vm.user.username != '' && vm.user.username != undefined) && (vm.user.firstName != '' && vm.user.firstName != undefined) && (vm.user.password != '' && vm.user.password != undefined) && (vm.user.agencia != '' && vm.user.agencia != undefined)){
        		if ((vm.user.username != '' && vm.user.username != undefined) && (vm.user.firstName != '' && vm.user.firstName != undefined) && (vm.user.password != '' && vm.user.password != undefined)){
	            	return true;	
	        	} else {
	        		FlashService.Error('Debe rellenar todos los campos');
	        		return false;
	        	}
        	} else {
        		//actualizacion, puede no meter la password porque ya tenia anteriormente
	        	if (vm.user.username != '' && vm.user.firstName != '' && vm.user.agencia != ''){
	            	return true;	
	        	} else {
	        		FlashService.Error('Debe rellenar todos los campos');
	        		return false;
	        	}        		
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
        	//Mientras ponemos el combo para que puedan determinar si es supervisor o usuario estandar
        	vm.user.profile = 3;
        	//Indicamos la misma agencia que el supervisor si es un supervisor
        	if (vm.currentUser.profile == 2)
        	{ 
        		vm.user.agencia = vm.currentUser.agencia;
        	}
            UserService.Create(vm.user)
                .then(function () {
                    FlashService.Success('Usuario creado correctamente');
                    findListUsers();
                    emptyFields();
                    clearForm();
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
        	}
        	//Solo listar 
        	if (vm.currentUser.profile == 2)
        	{        	
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
        }
        
        function findUser() {
        	vm.lastUserQuery = clone(vm.user);
            UserService.GetByFilter(vm.user)
                .then(function (user) {
            		vm.userList = user;
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }
        
        function emptyFields(){
        	if (vm.user != null)
        	{
        		delete vm.user._id;
        		delete vm.user.hash;
        		delete vm.user.username;
	    		delete vm.user.firstName;
	    		delete vm.user.lastName;
	    		//delete vm.user.superiorUser;
	    		delete vm.user.password;
	    		delete vm.user.agencia;
        	}
        }
        
        function clearFieldsForm(){
        	//Estas dos funciones son practicamente iguales. Habria que ver...Solo cambia agencia
    		delete vm.user._id;
    		delete vm.user.hash;        	
    		delete vm.user.username;
    		delete vm.user.firstName;
    		delete vm.user.lastName;
    		delete vm.user.password;        	
        }        
        
        function clearForm()
        {
        	//Primero limpiamos le formulario
       		emptyFields();
        	//Mostramos los botones de buscar y nuevo
        	$("#btnSearch").show();
        	$("#btnPlus").show();
        	//Ocultamos los otros botones
        	$("#btnOk").hide();
        	$("#btnCancel").hide();
        	delete vm.action;
        	findListUsers();
        }
        
        function prepareUpdate(userName)
        {
        	
        	showOkCancelButtons();
        	//inicializamos obj
        	clearFieldsForm();
        	vm.user.username = userName;
            UserService.GetByFilter(vm.user)
            .then(function (user) {
            	vm.action = 1;
            	vm.user = user[0];
            })
            .catch(function (error) {
                FlashService.Error(error);
            });        	
        	
        }
        
        function clone(obj) {
            if (null == obj || "object" != typeof obj) return obj;
            var copy = obj.constructor();
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
            }
            return copy;
        }
    }

})();