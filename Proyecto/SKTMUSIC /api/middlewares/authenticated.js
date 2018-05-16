// Middleware de autenticación.

'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = '%6%ClAvE_s3Cr3tA_%6$';

exports.ensureAuth = (req, res, next) => {

	if(!req.headers.authorization){

		return res.status(403).send({message: 'La petición no tiene autenticación'});

	}
		var token = req.headers.authorization.replace(/['"]+/g, '');
		try{
			var payload = jwt.decode(token, secret)

			if(payload.exp <= moment().unix()){
			return res.status(401).send({message: 'token expirado, fecha invalida'});

			}

		}catch(ex){
		return res.status(404).send({message: 'Token no válido'});

		}

		req.user = payload;

		next();
};	