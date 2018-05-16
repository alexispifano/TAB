//express.js
//author: Alexis Pifano
'use strict'

var express = require("express");
var bodyparser = require("body-parser");
var bcrypt = require("bcrypt-nodejs");
var app = express();


// rutas
var user_routes = require('./routes/user');
var artis_routes = require('./routes/artist');
var album_routes = require('./routes/album');
var song_routes = require('./routes/song');

app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
////////////////////////////////////////////////////////////////////////

// cabeceras http
app.use( (req,res, next)=>{
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-LEY, Origin, X-Requested-With, Content-type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Method', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

	next();
});
////////////////////////////////////////////////////////////////////////

// carga de rutas bases
app.use('/api', user_routes);
app.use ('/api', artis_routes);
app.use ('/api', album_routes);
app.use ('/api', song_routes);

///////////////////////////////////////////////////////////////////////

// exportación del modulo

module.exports = app;