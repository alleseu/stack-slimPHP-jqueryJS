/*!
 * LÓGICA DE LA VISTA - MANTENEDOR.
 * Copyright 2021 - Alejandro Alberto Sánchez Iturriaga.
 */


let ID;  //Variable global para el Identificador del producto seleccionado en la tabla.

//DOCUMENT.READY - EJECUTA LAS FUNCIONES UNA VEZ CARGADO EL CONTENIDO HTML DE LA PÁGINA WEB (DOM).
$(function() {

	//Se define y configura la datatable.
	$('#tabla').DataTable({
		processing: false,
        deferRender: true,
        responsive: true,
		ajax: {
			url: URL_BASE+'api/productos',
			type: 'GET',
			error: function(jqXHR, exception) {
				console.log(jqXHR, exception);

				//LLAMA A LA FUNCIÓN QUE MUESTRA EL MENSAJE DEL RESULTADO DE ERROR.
				mostrarMensajeResultado('fa-times-circle', 'Error', 'red', 'Hubo un error interno, contáctese con el soporte.', null);
			}
		},
		columns: [
			{
				data:"codigo",
				searchable: true,
                orderable: true,
                className: "text-right"
			},
			{
				data:"producto",
				searchable: true,
                orderable: true,
                className: "text-center"
			},
			{
				data:"nombreCategoria",
				searchable: true,
                orderable: true,
                className: "text-center"
			},
			{
				data:"fechaCreacion",
				searchable: true,
                orderable: true,
                className: "text-center"
			},
			{
				data:"fechaActualizacion",
				searchable: true,
                orderable: true,
                className: "text-center"
			},
			{
				data:"id",
				searchable: false,
                orderable: false,
                className: "text-center",
				render: function ( data, type, row, meta ) {
					const herramientas = `
						<a class="action-button" name="boton_editar" data-id="${data}" title="Editar producto">
							<i class="fas fa-edit fa-lg"></i>
						</a>
						<a class="action-button" name="boton_eliminar" data-id="${data}" title="Eliminar producto">
							<i class="fas fa-trash-alt fa-lg"></i>
						</a>
					`;
					return herramientas;
				}
			}
		],
		language: {
            url: "frontend/resources/libraries/dataTables/spanish.json"
        }
	});


	//FUNCIÓN PARA CARGAR EL MODAL 1: CREACIÓN DE PRODUCTOS.
	$('#boton_crear').click(function() {

		$.ajax({
			url: URL_BASE+'api/categorias',
			type: 'GET',
			dataType: 'json'

		}).done(function(response) {
			console.log(response);

			//COMPRUEBA EL RESULTADO DE LA SOLICITUD.
			if(response.resultado === EXITO) {

				$('#c_categoria').html('<option value="" selected disabled>Seleccione la categoría del producto</option>');

				//Agrega las categorías a la lista.
				$.each(response.data, function (index, value) {
					$('#c_categoria').append('<option value="'+ value['id'] +'">'+ value['descripcion'] +'</option>');
				});

				//Limpia los campos de texto del formulario.
				$('#c_codigo').val(null);
				$('#c_producto').val(null);
				$('#c_categoria').val(null);

				$('#modal1').modal('show');  //Abre el modal 1.
			}
			else {

				//LLAMA A LA FUNCIÓN QUE MUESTRA EL MENSAJE DEL RESULTADO DE ERROR.
				mostrarMensajeResultado('fa-exclamation-circle', 'Error', 'orange', response.mensaje, null);
			}
		}).fail(function(jqXHR, textStatus, errorThrown) {
			console.log(textStatus, errorThrown);

			//LLAMA A LA FUNCIÓN QUE MUESTRA EL MENSAJE DEL RESULTADO DE ERROR.
			mostrarMensajeResultado('fa-times-circle', 'Error', 'red', 'Hubo un error interno, contáctese con el soporte.', null);
		});
	});


	//FUNCIÓN PARA CARGAR EL MODAL 2: ACTUALIZACIÓN DE PRODUCTOS.
    $(document).on('click', '[name=boton_editar]', function() {

		//Se guarda el identificador del producto seleccionado.
		ID = $(this).attr("data-id");

        $.ajax({
			url: URL_BASE+'api/categorias',
			type: 'GET',
			dataType: 'json'
	
		}).done(function(response) {
			console.log(response);
	
			//COMPRUEBA EL RESULTADO DE LA SOLICITUD.
			if(response.resultado === EXITO) {
	
				$('#a_categoria').html('<option value="" selected disabled>Seleccione la categoría del producto</option>');
	
				//Agrega las categorías a la lista.
				$.each(response.data, function (index, value) {
					$('#a_categoria').append('<option value="'+ value['id'] +'">'+ value['descripcion'] +'</option>');
				});

				$.ajax({
					url: URL_BASE+'api/producto/'+ID,
					type: 'GET',
					dataType: 'json'
			
				}).done(function(response) {
					console.log(response);
			
					//COMPRUEBA EL RESULTADO DE LA SOLICITUD.
					if(response.resultado === EXITO) {
			
						//Agrega los datos del producto seleccionado en los campos del modal.
						$('#a_codigo').val(response.data.codigo);
						$('#a_producto').val(response.data.producto);
						$('#a_categoria').val(response.data.idCategoria);
		
						$('#modal2').modal('show');  //Abre el modal 2.
					}
					else {
			
						//LLAMA A LA FUNCIÓN QUE MUESTRA EL MENSAJE DEL RESULTADO DE ERROR.
						mostrarMensajeResultado('fa-exclamation-circle', 'Error', 'orange', response.mensaje, null);
					}
				}).fail(function(jqXHR, textStatus, errorThrown) {
					console.log(textStatus, errorThrown);
			
					//LLAMA A LA FUNCIÓN QUE MUESTRA EL MENSAJE DEL RESULTADO DE ERROR.
					mostrarMensajeResultado('fa-times-circle', 'Error', 'red', 'Hubo un error interno, contáctese con el soporte.', null);
				});
			}
			else {
	
				//LLAMA A LA FUNCIÓN QUE MUESTRA EL MENSAJE DEL RESULTADO DE ERROR.
				mostrarMensajeResultado('fa-exclamation-circle', 'Error', 'orange', response.mensaje, null);
			}
		}).fail(function(jqXHR, textStatus, errorThrown) {
			console.log(textStatus, errorThrown);
	
			//LLAMA A LA FUNCIÓN QUE MUESTRA EL MENSAJE DEL RESULTADO DE ERROR.
			mostrarMensajeResultado('fa-times-circle', 'Error', 'red', 'Hubo un error interno, contáctese con el soporte.', null);
		});
    });


	//FUNCIÓN PARA CARGAR EL MODAL 3: ELIMINACIÓN DE PRODUCTOS.
	$(document).on('click', '[name=boton_eliminar]', function() {

        //Se guarda el identificador del producto seleccionado.
		ID = $(this).attr("data-id");

        $.ajax({
			url: URL_BASE+'api/producto/'+ID,
			type: 'GET',
			dataType: 'json'
	
		}).done(function(response) {
			console.log(response);
	
			//COMPRUEBA EL RESULTADO DE LA SOLICITUD.
			if(response.resultado === EXITO) {
	
				//Agrega los datos del producto seleccionado en la tabla en los campos del modal.
				$('#e_codigo').html(response.data.codigo);
				$('#e_producto').html(response.data.producto);
				$('#e_categoria').html(response.data.nombreCategoria);

				$('#modal3').modal('show');  //Abre el modal 3.
			}
			else {
	
				//LLAMA A LA FUNCIÓN QUE MUESTRA EL MENSAJE DEL RESULTADO DE ERROR.
				mostrarMensajeResultado('fa-exclamation-circle', 'Error', 'orange', response.mensaje, null);
			}
		}).fail(function(jqXHR, textStatus, errorThrown) {
			console.log(textStatus, errorThrown);
	
			//LLAMA A LA FUNCIÓN QUE MUESTRA EL MENSAJE DEL RESULTADO DE ERROR.
			mostrarMensajeResultado('fa-times-circle', 'Error', 'red', 'Hubo un error interno, contáctese con el soporte.', null);
		});
    });


	//FUNCIÓN PARA CREAR UN NUEVO PRODUCTO.
	$('#form_modal1').submit(function(event) {
		event.preventDefault();

		$('#boton_modal1').html('<span class="spinner-border spinner-border-sm mr-2"></span>GUANDANDO...');

		//SE DEFINE LOS PARÁMETROS PARA ENVIAR EN EL BODY DE LA SOLICITUD.
		const parametros = {
			codigo: $('#c_codigo').val(),
			producto: $('#c_producto').val(),
			categoria: $('#c_categoria').val()
		}

		$.ajax({
			url: URL_BASE+'api/producto',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(parametros),
			dataType: 'json'

		}).done(function(response) {
			console.log(response);

			$('#boton_modal1').html('GUARDAR<i class="fas fa-save ml-2"></i>');

			//COMPRUEBA EL RESULTADO DE LA SOLICITUD.
			if (response.resultado === EXITO) {

				//LLAMA A LA FUNCIÓN QUE MUESTRA EL MENSAJE DEL RESULTADO DE ÉXITO.
				mostrarMensajeResultado('fa-check-circle', 'Felicidades', 'green', response.mensaje, function() {	

					window.location.reload();  //Recarga la página web.
				});
			}
			else {

				//LLAMA A LA FUNCIÓN QUE MUESTRA EL MENSAJE DEL RESULTADO DE ERROR.
				mostrarMensajeResultado('fa-exclamation-circle', 'Error', 'orange', response.mensaje, null);
			}
		}).fail(function(jqXHR, textStatus, errorThrown) {
			console.log(textStatus, errorThrown);

			//LLAMA A LA FUNCIÓN QUE MUESTRA EL MENSAJE DEL RESULTADO DE ERROR.
			mostrarMensajeResultado('fa-times-circle', 'Error', 'red', 'Hubo un error interno, contáctese con el soporte.', function() {
				
				$('#modal1').modal('hide');  //Cierra el modal 1.
			});
		});
	});


	//FUNCIÓN PARA ACTUALIZAR UN PRODUCTO.
	$('#form_modal2').submit(function(event) {
		event.preventDefault();

		$('#boton_modal2').html('<span class="spinner-border spinner-border-sm mr-2"></span>GUANDANDO...');

		//SE DEFINE LOS PARÁMETROS PARA ENVIAR EN EL BODY DE LA SOLICITUD.
		const parametros = {
			codigo: $('#a_codigo').val(),
			producto: $('#a_producto').val(),
			categoria: $('#a_categoria').val()
		}

		$.ajax({
			url: URL_BASE+'api/producto/'+ID,
			type: 'PUT',
			contentType: 'application/json',
			data: JSON.stringify(parametros),
			dataType: 'json'

		}).done(function(response) {
			console.log(response);

			$('#boton_modal2').html('GUARDAR CAMBIOS<i class="fas fa-save ml-2"></i>');

			//COMPRUEBA EL RESULTADO DE LA SOLICITUD.
			if (response.resultado === EXITO) {

				//LLAMA A LA FUNCIÓN QUE MUESTRA EL MENSAJE DEL RESULTADO DE ÉXITO.
				mostrarMensajeResultado('fa-check-circle', 'Felicidades', 'green', response.mensaje, function() {	

					window.location.reload();  //Recarga la página web.
				});
			}
			else {

				//LLAMA A LA FUNCIÓN QUE MUESTRA EL MENSAJE DEL RESULTADO DE ERROR.
				mostrarMensajeResultado('fa-exclamation-circle', 'Error', 'orange', response.mensaje, null);
			}
		}).fail(function(jqXHR, textStatus, errorThrown) {
			console.log(textStatus, errorThrown);

			//LLAMA A LA FUNCIÓN QUE MUESTRA EL MENSAJE DEL RESULTADO DE ERROR.
			mostrarMensajeResultado('fa-times-circle', 'Error', 'red', 'Hubo un error interno, contáctese con el soporte.', function() {
				
				$('#modal2').modal('hide');  //Cierra el modal 2.
			});
		});
	});


	//FUNCIÓN PARA ELIMINAR UN PRODUCTO.
	$('#boton_modal3').click(function() {

		$('#boton_modal3').html('<span class="spinner-border spinner-border-sm mr-2"></span>ELIMINANDO...');

		$.ajax({
			url: URL_BASE+'api/producto/'+ID,
			type: 'DELETE',
			dataType: 'json'

		}).done(function(response) {
			console.log(response);

			$('#boton_modal3').html('CONFIRMAR<i class="fas fa-check-circle ml-2"></i>');

			//COMPRUEBA EL RESULTADO DE LA SOLICITUD.
			if (response.resultado === EXITO) {

				//LLAMA A LA FUNCIÓN QUE MUESTRA EL MENSAJE DEL RESULTADO DE ÉXITO.
				mostrarMensajeResultado('fa-check-circle', 'Felicidades', 'green', response.mensaje, function() {	

					window.location.reload();  //Recarga la página web.
				});
			}
			else {

				//LLAMA A LA FUNCIÓN QUE MUESTRA EL MENSAJE DEL RESULTADO DE ERROR.
				mostrarMensajeResultado('fa-exclamation-circle', 'Error', 'orange', response.mensaje, null);
			}
		}).fail(function(jqXHR, textStatus, errorThrown) {
			console.log(textStatus, errorThrown);

			//LLAMA A LA FUNCIÓN QUE MUESTRA EL MENSAJE DEL RESULTADO DE ERROR.
			mostrarMensajeResultado('fa-times-circle', 'Error', 'red', 'Hubo un error interno, contáctese con el soporte.', function() {
				
				$('#modal3').modal('hide');  //Cierra el modal 3.
			});
		});
	});
});
