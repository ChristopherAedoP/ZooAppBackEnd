'use strict';


var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clavesecretadelcursodeangular4avanzado';


exports.ensureAuth = function (req, res, next) {
	if (!req.headers.authorization) {
		return res.status(403).send({
			mensaje: 'la peticion no tiene la cabecera de autentificacion'
		});
	}

	var token = req.headers.authorization.replace(/['"]+/g,'');
	
	try {
		var payload = jwt.decode(token,secret);

		if ( payload.exp <= moment().unix()) {
			return res.status(401).send({
				mensaje: 'token expirado'
			});
		}

	} catch (ex) {
		return res.status(404).send({
			mensaje: 'token invalido'
		});
	}

	req.user = payload;

	next();
};