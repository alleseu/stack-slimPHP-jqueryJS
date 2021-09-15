/*!
 * LÓGICA DE LA VISTA.
 * Copyright 2020 - Alejandro Alberto Sánchez Iturriaga.
 */


//Se definen las principales constantes.
const URL_BASE = 'http://localhost/stack/backend/';
const TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2MzE2NjgyMTcsImV4cCI6MTY2MzIwNDIxNywiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.7n_r0dP7f7hQyMf6kBlIch4F5vrmBS33FeRipP53HRg';
const EXITO = 1;
const ERROR_ENTRADA = -1;
const ERROR_VALIDACION = -2;
const ERROR_EXCEPCION = -3;


//FUNCIÓN QUE MUESTRA EL MENSAJE DEL RESULTADO DE ÉXITO O ERROR.
function mostrarMensajeResultado(icono, titulo, color, mensaje, funcion) {

	$.alert({
		icon: 'fas '+ icono +' fa-lg',
		title: titulo,
		type: color,
		typeAnimated: true,
		theme: 'material',
		animation: 'rotate',
		closeAnimation: 'scale',
		content: mensaje,
		buttons: {
			cerrar: {
				text: 'CERRAR',
				btnClass: 'btn-person',
				isHidden: false,
				isDisabled: false,
				action: funcion
			}
		}
	});
}


//FUNCIÓN QUE MUESTRA EL MENSAJE DE CONFIRMACIÓN PARA LA SOLICITUD.
function mostrarMensajeConfirmacion(mensaje, funcion) {

	$.confirm({
		icon: 'fas fa-question-circle fa-lg',
		title: 'Confirmación',
		type: 'blue',
		typeAnimated: true,
		theme: 'material',
		columnClass: 'col-md-6 col-md-offset-3',
		animation: 'rotate',
		closeAnimation: 'scale',
		content: mensaje,
		buttons: {
			confirmar: {
				text: 'CONFIRMAR',
				btnClass: 'btn-person',
				isHidden: false,
				isDisabled: false,
				action: funcion
			},
			cancelar: {
				text: 'CANCELAR',
				btnClass: 'btn-person',
				isHidden: false,
				isDisabled: false,
				action: null
			}
		}
	});
}


//DOCUMENT.READY - EJECUTA LAS FUNCIONES UNA VEZ CARGADO EL CONTENIDO HTML DE LA PÁGINA WEB (DOM).
$(function() {

	//FUNCIÓN PARA IR AL TOP DE LA PÁGINA.
	function subir() {

		//Obtiene la posición vertical actual de la barra de desplazamiento. Si es superior a 50px, muestra el botón para ir arriba, si es inferior lo oculta.
		$(window).scroll(function() {
			if ($(this).scrollTop() > 50) {
				$('.scroll-up').fadeIn();
			} else {
				$('.scroll-up').fadeOut();
			}
		});

		//ScrollTop nos desplaza hacia al comienzo de la página web, en la posición 0px, y 500 representa la duración de la animación en milisegundos.
		$('.scroll-up').click(function() {
			$('html, body').animate({ scrollTop: 0 }, 500);
			return false;
		});
	}


	//FUNCIÓN PARA BLOQUEAR CARACTERES NO NUMÉRICOS.
	$('[name="codigo"]').keypress(function(tecla) {

		if (tecla.charCode < 48 || tecla.charCode > 57) return false;
	});
	

	//LLAMA A LA FUNCIÓN PARA IR AL TOP DE LA PÁGINA.
	subir();
});


//WINDOW.ONLOAD - EJECUTA LAS FUNCIONES UNA VEZ CARGADO TODO EL CONTENIDO HTML Y LOS RECURSOS GRAFICOS.
window.onload = function() {

	$('#spinner').hide();  //Oculta el spinner de carga.
};

