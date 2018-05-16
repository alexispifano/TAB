'use strict'

var fs = require('fs');
var path = require('path');
var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../service/jwt')

// función del guardado de usuario.

function SaveUser(req, res) {
	
	var user = new User();
	var params = req.body;
	var email = params.email
	console.log (params);

	user.name = params.name;
	user.surname = params.surname;
	user.email = params.email;
	user.role = 'ROLE_USER';
	user.image = 'null';

			User.findOne({email:email.toLowerCase()}, (err, User) =>{

			if(err){
				res.status(500).send({message: 'error en la petición'});
			}
			else {
				if(User){
					res.status(404).send({message: 'El usuario ya está registrado'});
				}

				else {
					if(params.password){
					// encriptar contraseña al recibirla
					bcrypt.hash(params.password, null, null, function(err, hash){
						user.password = hash;

						if(user.name != null && user.surname != null && user.email != null ){
						
						// guardar datos en la BBDD
						user.save((err, userStored) => {

							if(err){
							res.status(500).send({message: 'Error al guardar el usuario'});
							}
							else{
								
								if(!userStored){

								res.status(404).send({message:'No se ha registrado el usuario'});

								}else{
								res.status(200).send({user: userStored});
								

								}
							}

						});

						}else{
									
						res.status(200).send({message: 'Rellena todos los datos'});

									}
								});
								
						}else {
						res.status(200).send({message: 'introduce la contraseña'});
							}
								}
									}

										});


}

// Empieza la función de Login del usuario

function LoginUser(req, res){
	
	var params = req.body;
	var email = params.email;
	var password = params.password;

	User.findOne({email:email.toLowerCase()}, (err, User) => {

		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{

			if(!User){

				res.status(404).send({message:'Error, el usuario no existe'});

			}else{
				// comprobar la contraseña 
				bcrypt.compare(password, User.password, (err, check) =>{

					if(check){

						// Si los datos son correctos devuelve los valores del usuario
						if(params.gethash){
							res.status(200).send({
								token: jwt.createToken(User)
							});
							//devolver un token de JWDD
						} else {
							res.status(200).send({User});
						}

					}else{
						res.status(404).send({message: 'Contraseña incorrecta'});
					}

				});
			}
		}

	});

}
// Actualización de usuario.

function updateUser(req, res) {

	var userId = req.params.id;
	var update = req.body;

	User.findByIdAndUpdate(userId, update, (err, userUpdated)=>{

		if(err){
			res.status(500).send({ message: 'Error del servidor. No se pudo actualizar el usuario' });
		} else{

			if(!userUpdated){
			res.status(404).send({ message: 'No se ha podido actualizar el usuario' }); }
		else{
			res.status(200).send({update, user: userUpdated });
		}
			 }
	});
}

// borrado de usuario

function removeUser (req, res){

	var userId = req.params.id; 
	var remove = req.body;

	User.findByIdAndRemove(userId, (err, userRemove) =>{

		if(err){

				res.status(500).send({message: 'Error en el servidor. No se ha podido procesar el borrado'});
		}else{

			if(!userRemove){

				res.status(404).send({message: 'error en la eliminación del usuario, usuario no existe'});
			} else {

				res.status(200).send({user: userRemove});
			}

		}

	});

}

// Creamos la subida de avatar

function uploadImg(req, res){

	var userId = req.params.id;
	var file_name = 'Imagen no subida';

	if(req.files){

		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];
		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if(file_ext == 'jpeg' || file_ext == 'png' || file_ext == 'gif' || file_ext == 'jpg'){

			User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated) => {

			if(!userUpdated){
			res.status(404).send({message: 'No se ha podido actualizar el avatar del usuario. Error del server'}); 
			}else{
			res.status(200).send({image: file_name, user: userUpdated});
			}
			
		});

		}else{
			res.status(200).send({message: 'Archivo no válido. solo png, jpeg, jpg y gif'});
		}
		
	}else {
		res.status(200).send({message : 'No has subido ninguna imagen'});
	}
}

function getImageFile(req, res){

	var imageFile = req.params.imageFile;
	var pathFile = './upload/users/'+imageFile;
	fs.exists(pathFile, function(exists){
		if(exists){
		res.sendFile(path.resolve(pathFile));
		} else{

		res.status(200).send({message : 'No existe la imagen'});

		}

	});
}

module.exports = {

	SaveUser,
	LoginUser,
	updateUser,
	removeUser,
	uploadImg,
	getImageFile
};