'use strict';
 
var express = require('express');
var bodyParse = require('body-parser');

var app = express();

//cargar archivos configuracion rutas
var userRoutes = require('./rutes/user');
var animalRoutes = require('./rutes/animal');


//middleware de bodyparser

app.use( bodyParse.urlencoded({ extended:false }) );
app.use( bodyParse.json() );

//configurar cabecera y cors
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin','*');
	res.header('Access-Control-Allow-Headers', 'Authorization,X-Api-KEY, Origin, X-Requested-with, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});

//rutas base
app.use('/api', userRoutes);
app.use('/api', animalRoutes);


module.exports = app;

