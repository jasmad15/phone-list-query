(function () {
    'use strict';

    angular
        .module('app')
        .controller('Identification.IndexController', Controller);

    function Controller(UserService, IdentificationService, FlashService) {
        var vm = this;

        vm.user = null;
        vm.currentUser = null;
        vm.listin = null;
        vm.findId = findId;

        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
                vm.currentUser = user;
                $("#lbUserName").text(vm.user.username);
                //Quitamos la opcion de users
                if (vm.user.profile != "1" && vm.user.profile != "2")
                {
                	$("#userManagement").remove();
                }
                //Quitamos la opcion de trazas
                if (vm.user.profile != 1)
                {
                	$("#loggingManagement").remove();
                	$("#identificationOpt").remove();
                }                
                //console.log (vm.user);                
            });
        }
        
        function findId() {
        	 initPanels();
        	 vm.identification.CIF_NIF = vm.identification.CIF_NIF.toUpperCase();
        	 if (vm.identification.CIF_NIF != undefined) {
        		 if (validate(vm.identification.CIF_NIF)) {
	        		 showSpinner('block');
	                 IdentificationService.findId(vm.identification)
	                 .then(function (data) {
	                     //FlashService.Success(data.TIPO);
	                     //resultSearchProcess(data.TIPO, vm.identification.CIF_NIF);
	                	 //console.log(data);
	                	 resultSearchProcess(data);
	                     //console.log ('ddd: ' + data.TIPO);
	                 })
	                 .catch(function (error) {
	                     FlashService.Error(error);
	                 });
            	 } else {
            		 FlashService.Error('Debes indicar un NIF/NIE valido');
            	 }
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
    	function resultSearchProcess(resultado) {
    		//Mostramos los paneles segun la respuest aque debuelva la consulta
    		$('#spinner').css('display','none');
    		if (resultado != null && resultado != undefined && resultado != '' ) {
    			$('#response-empty').css('display','block');
    			//$('#response-empty-phoneSearch').html(phoneNumber);
    			//$('#messageMobile-panel').css('display','block');
    		} else {
    			$('#response-g').css('display','block');
    			//$('#response-g-phoneSearch').html(phoneNumber);
    			//$('#messageMobile-panel').css('display','block');
    		}
    		//$('#messageMobile-panel').css('display','block');	
    	}
    	function validate(value){

    		  var validChars = 'TRWAGMYFPDXBNJZSQVHLCKET';
    		  var nifRexp = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKET]{1}$/i;
    		  var nieRexp = /^[XYZ]{1}[0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKET]{1}$/i;
    		  var str = value.toString().toUpperCase();

    		  if (!nifRexp.test(str) && !nieRexp.test(str)) return false;

    		  var nie = str
    		      .replace(/^[X]/, '0')
    		      .replace(/^[Y]/, '1')
    		      .replace(/^[Z]/, '2');

    		  var letter = str.substr(-1);
    		  var charIndex = parseInt(nie.substr(0, 8)) % 23;

    		  if (validChars.charAt(charIndex) === letter) return true;

    		  return false;
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