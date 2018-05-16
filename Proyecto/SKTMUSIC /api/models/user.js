'use strict'

// llamamos a moongose, para interactuar con la database
var mongoose = require('mongoose');

// nos permite usar la base de datos de tipo esquema, guardando datos en una colección concreta
var Schema = mongoose.Schema;

var UserSchema = Schema({

			name: String,
			surname: String,
			email: String,
			password: String,
			role: String,
			image: String
});
 
// moongose.model creamos la colección "User" en nuestra database y a su vez,
// le decimos que use el esquema creado

module.exports = mongoose.model('User', UserSchema);