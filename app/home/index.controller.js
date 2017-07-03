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
                $("#lbUserName").text(vm.user.username);
                //console.log (vm.user);                
            });
        }
        
        function findNumber() {
        	 //console.log ('a ' + vm.listin.NVOMSISDN);
        	 initPanels();
        	 
        	 if (vm.listin.NVOMSISDN != undefined) {
        		 showSpinner('block');
                 PhoneListService.findNumber(vm.listin)
                 .then(function (data) {
                     //FlashService.Success(data.TIPO);
                     resultSearchProcess(data.TIPO, vm.listin.NVOMSISDN);
                     //console.log ('ddd: ' + data.TIPO);
                 })
                 .catch(function (error) {
                     FlashService.Error(error);
                 });        		 
        	 } else {
        		 FlashService.Error('Debes rellenar el número a búscar');
        	 }
        }
        function showSpinner(state){
        	$('#spinner').css('display',state);
        }
        
        /* Funciones estandar */
    	function initPanels() {
    		//Inicializamos los paneles. Lo normal es que sea al entrar en el propio campo y como minimo al pulsar sobre el boton de busqueda
    		
    		$('#response-empty').css('display','none');
    		$('#response-a').css('display','none');
    		$('#response-g').css('display','none');
    		$('#messageMobile-panel').css('display','none');
    		
    		/*
    		$('#response-empty').hide(1000);
    		$('#response-a').hide(1000);
    		$('#response-g').hide(1000);
    		$('#messageMobile-panel').css('display','none');
    		*/
    		//El spinner tambien por si se hubiese quedado por ahi
    		showSpinner('none');
    	}
    	function resultSearchProcess(resultado, phoneNumber) {
    		//Mostramos los paneles segun la respuest aque debuelva la consulta
    		$('#spinner').css('display','none');
    		if (resultado === "A") {
    			$('#response-empty').css('display','block');
    			$('#response-empty-phoneSearch').html(phoneNumber);
    			$('#messageMobile-panel').css('display','block');
    		} else if (resultado === "B") {
    			$('#response-a').css('display','block');
    			$('#response-a-phoneSearch').html(phoneNumber);
    			$('#messageMobile-panel').css('display','block');
    		} else if (resultado === null || resultado === undefined) {
    			$('#response-g').css('display','block');
    			$('#response-g-phoneSearch').html(phoneNumber);
    			$('#messageMobile-panel').css('display','block');
    		}
    		//$('#messageMobile-panel').css('display','block');	
    	}
    	$(document).ready(function(){
    		//Inicializamos los paneles cuando vuelve a entrar en el campo. Damos por hecho que quiere una nueva consulta
        	$("#phoneValidate").focusin(function(){
            	initPanels();
        	});
        	//console.log(vm.user);
    	});        
        
    }

})();