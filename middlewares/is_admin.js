'use strict';

exports.isAdmin = function(req, res, next) {
	if (req.user.role != 'ROLE_ADMIN') {
		return res.status(200).send({
			mensaje:'no tienes acceso a esta zona'
		});
	} else {
		next();
	}
};