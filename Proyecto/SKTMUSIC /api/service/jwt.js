'use strict'
// creamos un token encriptado para ejecutarlo con gethash.
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = '%6%ClAvE_s3Cr3tA_%6$';

exports.createToken = function (user){

	var payload = {

		sub: user._id,
		name: user.name,
		surname: user.surname,
		email: user.email,
		role: user.role,
		image: user.image,
		iat: moment().unix(),
		exp: moment().add(30, 'days').unix(),
	};

	return jwt.encode(payload, secret);
}