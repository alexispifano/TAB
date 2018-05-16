//Inicio del backend app de adopción animal
//Author: Alexis Pifano & Susana Nuñez Marín

'use strict' 
var mongoose = require('mongoose');
var app = require("./app");
var port = process.env.PORT || 21210;

 //La conexión a la bbdd no puede tener dos /
mongoose.Promise = global.Promise; // Evita mensaje de aviso en la consola de moongose
mongoose.connect('mongodb://localhost:27017/animalsasleaders', (err, res) => {
if(err){
	throw err;
} else {
	console.log('La conexión a la base de datos está funcionando correctamente en la bbdd');
	app.listen(port, function(){
	console.log('Servidor funcionando correctamente en el puerto ' +port);
	});
}
});