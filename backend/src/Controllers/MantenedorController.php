<?php namespace App\Controllers;

use App\Controllers\BaseController;


class MantenedorController extends BaseController {

	//FUNCIÓN PARA PROCESAR LA OBTENCIÓN DE LOS PRODUCTOS.
	public function obtenerProductos($request, $response, $args) {

		//LLAMA A LA FUNCIÓN QUE OBTIENE TODOS LOS PRODUCTOS. (SI NO HAY PRODUCTOS, RETORNA VACÍO).
		$data = $this->container->get('modelo_producto')->obtenerTodo();

		$respuesta = ['data' => $data];
		
		$response->getBody()->write(json_encode($respuesta));
		return $response
			->withHeader('content-type', 'application/json')
			->withStatus(200);
	}


	//FUNCIÓN PARA PROCESAR LA OBTENCIÓN DE LAS CATEGORÍAS.
	public function obtenerCategorias($request, $response, $args) {

		//LLAMA A LA FUNCIÓN QUE OBTIENE TODAS LAS CATEGORÍAS. (SI NO HAY CATEGORÍAS, RETORNA VACÍO).
		$data = $this->container->get('modelo_categoria')->obtenerTodo();

		//Comprueba que el dato obtenido no está vacío.
		if (!empty($data)) {

			$respuesta = [
				'resultado' => EXITO,
				'data' => $data
			];
		}
		else {

			$respuesta = [
				'resultado' => ERROR_ENTRADA,
				'mensaje' => 'No existen categorías.'
			];
		}
		
		$response->getBody()->write(json_encode($respuesta));
		return $response
			->withHeader('content-type', 'application/json')
			->withStatus(200);
	}


	//FUNCIÓN PARA PROCESAR LA OBTENCIÓN DE UN PRODUCTO.
	public function obtenerProducto($request, $response, $args) {

		//Se obtiene el dato recibido por la URI.
		$id = $args['id'];

		//Comprueba que todos los caracteres del string, son numéricos.
		if (ctype_digit($id)) {

			//LLAMA A LA FUNCIÓN QUE OBTIENE UN PRODUCTO DE UN IDENTIFICADOR ESPECÍFICO. (SI NO HAY PRODUCTO, RETORNA VACÍO).
			$data = $this->container->get('modelo_producto')->obtener($id);

			//Comprueba que el dato obtenido no está vacío.
			if (!empty($data)) {

				$respuesta = [
					'resultado' => EXITO,
					'data' => $data
				];
			}
			else {

				$respuesta = [
					'resultado' => ERROR_VALIDACION,
					'mensaje' => 'El producto no existe.'
				];
			}
		}
		else {

			$respuesta = [
				'resultado' => ERROR_ENTRADA,
				'mensaje' => 'Dato no numérico.'
			];
		}
		
		$response->getBody()->write(json_encode($respuesta));
		return $response
			->withHeader('content-type', 'application/json')
			->withStatus(200);
	}


	//FUNCIÓN PARA PROCESAR LA CREACÍON DE UN PRODUCTO NUEVO.
	public function crearProducto($request, $response, $args) {

		//Se obtienen los parámetros recibidos por el body en formato raw.
		$json = $request->getBody();
		$parametro = json_decode($json, true);

		//Comprueba que los datos recibidos no están vacíos.
		if (!empty($parametro)) {

			$codigo = $parametro['codigo'];
			$nombre = $parametro['producto'];
			$categoria = $parametro['categoria'];

			//Comprueba que todos los caracteres en las strings entregadas, son numéricos.
			if (ctype_digit($codigo) && ctype_digit($categoria)) {

				//Comprueba la longitud de carácteres para las variables de tipo string.
				if (strlen($codigo) == 3 && strlen($nombre) <= 30) {

					//LLAMA A LA FUNCIÓN QUE BUSCA SI ESTÁ REGISTRADO EL IDENTIFICADOR DE LA CATEGORÍA.
					$busqueda = $this->container->get('modelo_categoria')->buscarId($categoria);

					if ($busqueda > 0) {

						//LLAMA A LA FUNCIÓN QUE BUSCA SI ESTÁ REGISTRADO EL CÓDIGO DEL PRODUCTO. (RETORNA LA CANTIDAD DE REGISTROS).
						$busqueda = $this->container->get('modelo_producto')->buscarCodigo($codigo);

						if ($busqueda == 0) {

							//LLAMA A LA FUNCIÓN PARA INSERTAR UN PRODUCTO NUEVO.
							$this->container->get('modelo_producto')->insertar($codigo, $nombre, $categoria);

							$respuesta = [
								'resultado' => EXITO,
								'mensaje' => 'El producto fue creado exitosamente.'
							];
						}
						else {

							$respuesta = [
								'resultado' => ERROR_VALIDACION,
								'mensaje' => 'El código del producto ya existe.'
							];
						}
					}
					else {

						$respuesta = [
							'resultado' => ERROR_VALIDACION,
							'mensaje' => 'La categoría del producto no existe.'
						];
					}
				}
				else {

					$respuesta = [
						'resultado' => ERROR_ENTRADA,
						'mensaje' => 'Longitud inválida.'
					];
				}
			}
			else {

				$respuesta = [
					'resultado' => ERROR_ENTRADA,
					'mensaje' => 'Dato no numérico.'
				];
			}
		}
		else {

			$respuesta = [
				'resultado' => ERROR_ENTRADA,
				'mensaje' => 'Dato nulo.'
			];
		}
		
		$response->getBody()->write(json_encode($respuesta));
		return $response
			->withHeader('content-type', 'application/json')
			->withStatus(200);
	}


	//FUNCIÓN PARA PROCESAR LA ACTUALIZACÍON DE UN PRODUCTO.
	public function actualizarProducto($request, $response, $args) {

		//Se obtiene el dato recibido por la URI.
		$id = $args['id'];

		//Se obtienen los parámetros recibidos por el body en formato raw.
		$json = $request->getBody();
		$parametro = json_decode($json, true);

		//Comprueba que los datos recibidos no están vacíos.
		if (!empty($parametro)) {

			$codigo = $parametro['codigo'];
			$nombre = $parametro['producto'];
			$categoria = $parametro['categoria'];

			//Comprueba que todos los caracteres en las strings entregadas, son numéricos.
			if (ctype_digit($id) && ctype_digit($codigo) && ctype_digit($categoria)) {

				//Comprueba la longitud de carácteres para las variables de tipo string.
				if (strlen($codigo) == 3 && strlen($nombre) <= 30) {

					//LLAMA A LA FUNCIÓN QUE BUSCA SI ESTÁ REGISTRADO EL IDENTIFICADOR DE LA CATEGORÍA.
					$busqueda = $this->container->get('modelo_categoria')->buscarId($categoria);

					if ($busqueda > 0) {

						//LLAMA A LA FUNCIÓN QUE BUSCA SI ESTÁ REGISTRADO EL CÓDIGO DEL PRODUCTO, DESCARTANDO UN IDENTIFICADOR ESPECÍFICO. (RETORNA LA CANTIDAD DE REGISTROS).
						$busqueda = $this->container->get('modelo_producto')->buscarCodigoFiltrado($id, $codigo);

						if ($busqueda == 0) {

							//LLAMA A LA FUNCIÓN PARA ACTUALIZAR UN PRODUCTO.
							$this->container->get('modelo_producto')->actualizar($id, $codigo, $nombre, $categoria);

							$respuesta = [
								'resultado' => EXITO,
								'mensaje' => 'El producto fue actualizado exitosamente.'
							];
						}
						else {

							$respuesta = [
								'resultado' => ERROR_VALIDACION,
								'mensaje' => 'El código del producto ya existe.'
							];
						}
					}
					else {

						$respuesta = [
							'resultado' => ERROR_VALIDACION,
							'mensaje' => 'La categoría del producto no existe.'
						];
					}
				}
				else {

					$respuesta = [
						'resultado' => ERROR_ENTRADA,
						'mensaje' => 'Longitud inválida.'
					];
				}
			}
			else {

				$respuesta = [
					'resultado' => ERROR_ENTRADA,
					'mensaje' => 'Dato no numérico.'
				];
			}
		}
		else {

			$respuesta = [
				'resultado' => ERROR_ENTRADA,
				'mensaje' => 'Dato nulo.'
			];
		}
		
		$response->getBody()->write(json_encode($respuesta));
		return $response
			->withHeader('content-type', 'application/json')
			->withStatus(200);
	}


	//FUNCIÓN PARA PROCESAR LA ELIMINACÍON DE UN PRODUCTO.
	public function eliminarProducto($request, $response, $args) {

		//Se obtiene el dato recibido por la URI.
		$id = $args['id'];

		//Comprueba que todos los caracteres del string, son numéricos.
		if (ctype_digit($id)) {

			//LLAMA A LA FUNCIÓN QUE BUSCA SI ESTÁ REGISTRADO EL IDENTIFICADOR DEL PRODUCTO.
			$busqueda = $this->container->get('modelo_producto')->buscarId($id);

			if ($busqueda > 0) {

				//LLAMA A LA FUNCIÓN PARA ELIMINAR UN PRODUCTO. (NO ELIMINA EL REGISTRO, SOLO ACTUALIZA LA FECHA).
				$this->container->get('modelo_producto')->eliminar($id);

				$respuesta = [
					'resultado' => EXITO,
					'mensaje' => 'El producto fue eliminado exitosamente.'
				];
			}
			else {

				$respuesta = [
					'resultado' => ERROR_VALIDACION,
					'mensaje' => 'El producto no existe.'
				];
			}
		}
		else {

			$respuesta = [
				'resultado' => ERROR_ENTRADA,
				'mensaje' => 'Dato no numérico.'
			];
		}
		
		$response->getBody()->write(json_encode($respuesta));
		return $response
			->withHeader('content-type', 'application/json')
			->withStatus(200);
	}
}