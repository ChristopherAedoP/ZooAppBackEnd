'use strict';

var express = require('express');
var animalController = require('./../controllers/animal');

var api = express.Router();

var md_auth = require('./../middlewares/authenticated');
var md_admin = require('./../middlewares/is_admin');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/animals' });



//defino rutas.
api.get('/pruebas-animal', md_auth.ensureAuth, animalController.pruebas);
api.post('/animal', [md_auth.ensureAuth, md_admin.isAdmin], animalController.saveAnimal);
api.get('/animals', animalController.getAnimals);
api.get('/animal/:id', animalController.getAnimal);
api.put('/animal/:id', [md_auth.ensureAuth, md_admin.isAdmin], animalController.updateAnimal);
api.post('/upload-image-animal/:id', [md_auth.ensureAuth, md_upload,  md_admin.isAdmin], animalController.uploadImage);
api.get('/get-image-animal/:imagefile', animalController.getImageFile);
api.delete('/animal/:id', [md_auth.ensureAuth, md_admin.isAdmin], animalController.deleteAnimal);

module.exports = api; 
