//Inicio del backend app estilo spotify
//Author: Alexis Pifano

'use strict' 
var mongoose = require('mongoose');
var app = require("./app");
var port = process.env.PORT || 21210;

 //La conexión a la bbdd no puede tener dos /
mongoose.Promise = global.Promise; // Evita mensaje de aviso en la consola de moongose
mongoose.connect('mongodb://localhost:27017/mean2', (err, res) => {
if(err){
	throw err;
} else {
	console.log('La conexión a la base de datos está funcionando correctamente');

	app.listen(port, function(){

		console.log('Servidor funcionando correctamente en el puerto ' +port);

	});
}

});