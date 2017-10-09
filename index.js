'use strict';

var app = require('./app');
var port = process.env.PORT || 3089;

var mongoose = require('mongoose');



mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/ZOO', {
	useMongoClient: true
})
	.then(() => {
		console.log('conectado a mongo DB.!!');
		app.listen(port, () => {
			console.log('el servidor local con node y express esta corriendo: http://localhost:' + port);
		});
	})
	.catch( err => console.log(err) );