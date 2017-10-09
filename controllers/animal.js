'use strict';
//modulos
var fs = require('fs');
var path = require('path');

//modelos
var User = require('./../models/user');
var Animal = require('./../models/animal');

//acciones => 
// req = peticion , res = respuesta
function pruebas(req, res) {
	res.status(200).send({
		message: 'probando el controllador de animales y la accion pruebas',
		user: req.user
	});
}

function saveAnimal(req, res) {

	//creo nuevo usuario 
	var animal = new Animal();
	//recoger parametros peticion
	var params = req.body;
	//console.log(params);

	if (params.name ) {
		//asignar datos animal
		animal.name = params.name;
		animal.description = params.description;
		animal.year = params.year;
		animal.image = null;
		animal.user = req.user.sub;

		//guardar datos
		animal.save((err, animalStored) => {
			if (err) {
				res.status(500).send({
					message: 'Error al guardar el animal'
				});
			} else {
				if (!animalStored) {
					res.status(404).send({
						message: 'No se a registrado el animal'
					});
				} else {
					res.status(200).send({
						animal: animalStored
					});
				}
			}
		});
	} else {
		res.status(200).send({
			message: 'introduce los datos correstamente'
		});
	}


	
}

function getAnimals(req, res) {

	Animal.find({}).populate({path: 'user'}).exec((err,animals) =>{
		if (err) {
			res.status(500).send({
				message: 'Error en la peticion'
			});
		} else {
			if (!animals) {
				res.status(404).send({
					message: 'No se encontraron registros'
				});
			} else {
				res.status(200).send({
					animals
				});
			}
		}
	});

}

function getAnimal(req, res) {
	var animalId = req.params.id;

	Animal.findById(animalId).populate({ path: 'user' }).exec((err, animal) => {
		if (err) {
			res.status(500).send({
				message: 'Error en la peticion'
			});
		} else {
			if (!animal) {
				res.status(404).send({
					message: 'No se encontro animal'
				});
			} else {
				res.status(200).send({
					animal
				});
			}
		}
	});

}

function updateAnimal(req, res) {

	var animalId = req.params.id;
	var update = req.body;


	Animal.findByIdAndUpdate(animalId, update, { new: true }, (err, animalUpdated) => {
		if (err) {
			res.status(500).send({
				message: 'error actualizar animal',
				err: err
			}); 
		} else {
			if (!animalUpdated) {
				res.status(404).send({
					message: 'no se actualizo el animal',
					err: err
				});
			} else {
				res.status(200).send({
					animal: animalUpdated
				});
			}
		}
	});
}

function uploadImage(req, res) {
	var animalId = req.params.id;
	var file_name = 'no subido';

	if (req.files) {
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		file_name = file_split[2];

		var ext_split = file_name.split('.');
		var file_ext = ext_split[1];

		if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {

			// if (userId != req.user.sub) {
			// 	res.status(500).send({
			// 		message: 'no tiene permisos para actualizar al usuario'
			// 	});
			// }

			Animal.findByIdAndUpdate(animalId, { image: file_name }, { new: true }, (err, animalUpdated) => {
				if (err) {
					res.status(500).send({
						message: 'error actualizar usuario',
						err: err
					});
				} else {
					if (!animalUpdated) {
						res.status(404).send({
							message: 'no se actualizo el usuario',
							err: err
						});
					} else {
						res.status(200).send({
							animal: animalUpdated,
							image: file_name
						});
					}
				}
			});

		} else {
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
	var path_file = './uploads/animals/' + imageFile;

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

function deleteAnimal(req, res) {
	var animalId = req.params.id;

	Animal.findByIdAndRemove(animalId , (err , animalRemoved) => {
		if (err) {
			res.status(500).send({
				message: 'error en la peticion'
			});
		} else {
			if (!animalRemoved) {
				res.status(404).send({
					message: 'no se a podido eliminar'
				});
			} else {
				res.status(200).send({
					animal: animalRemoved
				});
			}
		}

	});
}


//exportar acciones -- ponerlas visibles.
module.exports = {
	pruebas,
	saveAnimal, 
	getAnimals,
	getAnimal,
	updateAnimal,
	uploadImage,
	getImageFile,
	deleteAnimal
};