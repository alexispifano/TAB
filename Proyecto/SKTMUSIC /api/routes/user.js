// user.js en route
'use strict'

var express = require('express');
var UserController = require('../controllers/user'); // llamamos al controlador de usuario.
var md_auth = require('../middlewares/authenticated'); 
var multiparty = require('connect-multiparty');
var md_upload = multiparty({uploadDir: './upload/users'});

//llamamos al controlador de rutas de express en una variable llamada api

var api = express.Router();

// Para pedir autentificación a una ruta, ha de llamar a la variable md_auth junto
// al método .ensureAuth
//api.get('/prueba', md_auth.ensureAuth, UserController.LaVariableExportada);

api.post('/register', UserController.SaveUser);
api.post('/login', UserController.LoginUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.put('/remove-user/:id', md_auth.ensureAuth, UserController.removeUser);
api.post('/upload-image-user/:id',[md_auth.ensureAuth, md_upload], UserController.uploadImg);
api.get('/get-image-user/:imageFile', UserController.getImageFile);





module.exports = api;
