'use strict';
//modulos
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');

//modelos
var User = require('./../models/user');

//servicio jwt
var jwt = require('./../service/jwt');

//acciones => 
// req = peticion , res = respuesta
function pruebas(req , res) {
	res.status(200).send({
		message: 'probando el controllador de usuario y la accion pruebas',
		user: req.user
	});
}

function saveUser(req, res) {

	//creo nuevo usuario 
	var user = new User();
	//recoger parametros peticion
	var params = req.body;
	//console.log(params);

	if (params.password && params.name && params.surname && params.email) {

		//asignar datos usuario
		user.name = params.name;
		user.surname = params.surname;
		user.email = params.email;
		user.role = 'ROLE_USER';
		user.image = null;

		//validar si exite usuario por correo.
		User.findOne({
			email: user.email.toLowerCase()
		}, (err, eluser) => {
			if (err) {
				res.status(500).send({
					message: 'Error al comprobar el usuario'
				});
			}else{
				if (!eluser) {
					//cifrar contraseña
					bcrypt.hash(params.password, null, null, (err, hash) => {
						user.password = hash;

						//guardar datos
						user.save((err, userStored) => {
							if (err) {
								res.status(500).send({
									message: 'Error al guardar el usuario'
								});
							} else {
								if (!userStored) {
									res.status(404).send({
										message: 'No se a registrado el usuario'
									});
								} else {
									res.status(200).send({
										user: userStored
									});
								}
							}
						});
					});
				}else{
					res.status(200).send({
						message: 'El no puede registrarse'
					});
				}
			}
		});

	}else{
		res.status(200).send({
			message: 'introduce los datos correstamente'
		});
	}
	
}

function login(req, res) {

	//recoger parametros peticion
	var params = req.body;

	var email= params.email;
	var password = params.password;

	//validar si exite usuario por correo.
	User.findOne({
		email: email.toLowerCase()
	},
	(err, eluser) => {
		if (err) {
			res.status(500).send({
				message: 'Error al comprobar el usuario'
			});
		} else {
			if (!eluser) {
				res.status(404).send({
					message: 'el usuario no a podido logearse'
				});
			} else {
				bcrypt.compare(password, eluser.password,(err, check) => {
					if (!check) {
						res.status(404).send({
							message: 'el usuario no a podido logearse'
						});
					}else{
						if (params.gettoken === 'true') {
							res.status(200).send({
								token: jwt.createToken(eluser)
							});
						}else{
							res.status(200).send({
								user: eluser
							});
						}
					}
				});
			}					
		}
	});

}

function updateUser(req, res) {
	
	var userId = req.params.id;
	var update = req.body;
	delete update.password;
	
	if (userId != req.user.sub) {
		res.status(500).send({
			message: 'no tiene permisos para actualizar al usuario'
		});
	}

	User.findByIdAndUpdate(userId, update, { new:true }, (err , userUpdated) => {
		if (err) {
			res.status(500).send({
				message: 'error actualizar usuario',
				err: err
			});
		} else {
			if (!userUpdated) {
				res.status(404).send({
					message: 'no se actualizo el usuario',
					err: err
				});
			} else {
				res.status(200).send({
					user: userUpdated
				});
			}
		}
	});
}

function uploadImage(req, res) {
	var userId = req.params.id;
	var file_name='no subido';

	if (req.files) {
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		file_name = file_split[2];

		var ext_split = file_name.split('.');
		var file_ext = ext_split[1];
		if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif' ) {
			
			if (userId != req.user.sub) {
				res.status(500).send({
					message: 'no tiene permisos para actualizar al usuario'
				});
			}

			User.findByIdAndUpdate(userId, { image: file_name }, { new: true }, (err, userUpdated) => {
				if (err) {
					res.status(500).send({
						message: 'error actualizar usuario',
						err: err
					});
				} else {
					if (!userUpdated) {
						res.status(404).send({
							message: 'no se actualizo el usuario',
							err: err
						});
					} else {
						res.status(200).send({
							user: userUpdated,
							image: file_name
						});
					}
				}
			});
						
		}else{
			fs.unlink(file_path, (err) => {
				if (err) {
					res.status(200).send({
						message: 'extension no valida y fichero no borrado'
					});	
				} else {
					res.status(200).send({
						message: 'extension no valida'
					});	
				}
			});

		}

	} else {
		res.status(200).send({
			message: 'no se han subido ficheros'
		});		
	}
}

function getImageFile(req, res) {

	var imageFile = req.params.imagefile;
	var path_file = './uploads/users/' + imageFile;

	fs.exists(path_file, (exists) => {
		if (exists) {
			res.sendFile(path.resolve(path_file));
		} else {
			res.status(404).send({
				message: 'la imagen no existe '
			});	
		}
	});


}

function getkeepers(req, res) {

	User.find({ role: 'ROLE_ADMIN' }).exec((err, users) => {
		if (err) {
			res.status(500).send({
				message: 'errro en la peticion',
				user: req.user
			});
		} else {
			if (!users) {
				res.status(404).send({
					message: 'sin cuidadores',
					user: req.user
				});
			} else {
				res.status(200).send({
					keepers: users
				});
			}
		}
	});
}

//exportar acciones -- ponerlas visibles.
module.exports = {
	pruebas,
	saveUser,
	login,
	updateUser,
	uploadImage,
	getImageFile,
	getkeepers
};