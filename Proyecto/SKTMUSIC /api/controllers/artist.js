'use strict'

var path = require('path');
var fs = require('fs');
var mongoosepaginate = require('mongoose-pagination');
var Album = require('../models/album');
var Artist = require('../models/artist');
var Song = require('../models/song');





// Guarda el artista en la base de datos

function SaveArtist (req, res){

	var artist = new Artist();
	var params = req.body;
	artist.name = params.name;
	artist.description = params.description;
	artist.image = 'null';

	artist.save((err, artistStored) => {

		if(err){
			res.status(500).send({ message: 'Ha habido un fallo en el servidor' });
		}else{
			if(!artistStored){
			res.status(200).send({ message: 'Se ha producido un error en guardar el usuario' });
		}else{

			res.status(200).send({ artist: artistStored });
		}

	}

}); 

}

function getArtist (req, res){
	
	var ArtistId = req.params.id;

	Artist.findById(ArtistId, (err, Artist) =>{

		if(err) {

			res.status(500).send({message: 'Error en la petición'});

		} else{
			
			if(!Artist){

			res.status(404).send({message: ' Error en la petición. No existe o es inválido'});

		}else{

			res.status(200).send({Artist});
		}

	}
	
	});

}

function getArtists (req, res) {

		if(req.params.page){

			var page = req.params.page;

		}else{
			
			var page = 1;
		
		}
		
		var ItemsPerPage = 5;

		Artist.find().sort('name').paginate(page, ItemsPerPage, (err, artists, total) =>{

			if (err){

				res.status(500).send({message: 'Error en la petición'});

			} else {

				if(!artists){

					res.status(404).send({message: 'Error en la petición. No hay raperos disponibles'});

				}else{

					return res.status(200).send({
						total_items: total,
						artists: artists

					});

				}

			}


		});
}

function DeleteArtist (req, res){
    var artistId = req.params.id;
    //Almacenamos los listados de los documents a borrar
    //[0] = Artista   [1] = Albums   [2] = Canciones
    var result = [];
    result[0] = artistId;
    //Buscamos los albums del Artista
    Album.find({ artist: artistId }).exec()
        .then((albums) => {
            //Guardamos los albums encontrados
            result[1] = albums;
            var songsQueries = [];
            //Buscamos las canciones de cada album del Artista
            albums.forEach((album) => {
                var promiseSong = Song.find({ album: album }).exec()
                songsQueries.push(promiseSong);
            })
            return Promise.all(songsQueries);
        })
        .then((listSongs) => {
            //Guardamos las canciones encontradas
            result[2] = listSongs;
            //Borramos las canciones listadas en result
            if (typeof result[2] != 'undefined') {
                var deleteSongsQueries = [];
                //Borramos las canciones de cada album del Artista
                result[2].forEach((arraySongs) => {
                    for (var i = 0; i < arraySongs.length; i++) {
                        var promiseDelSong = Song.findByIdAndRemove(arraySongs[i]._id).exec()
                        deleteSongsQueries.push(promiseDelSong);
                    }
                })
                Promise.all(deleteSongsQueries)
                    .then((listDeletedSongs) => {
                        if (listDeletedSongs.length != 0) {
                            console.log('Las siguientes canciones han sido borradas: ' + listDeletedSongs);
                        }
                    })
            } else {
                console.log('El artista ' + artistId + ' no tiene canciones asociadas');
            }
        })
        .then(() => {
            //Borramos los albums
            if (typeof result[1] != 'undefined') {
                var deleteAlbumsQueries = [];
                //Borramos los albums de cada Artista
                result[1].forEach((album) => {
                    var promiseAlbum = Album.findByIdAndRemove(album._id).exec()
                    deleteAlbumsQueries.push(promiseAlbum);
                })
                Promise.all(deleteAlbumsQueries)
                    .then((listDeletedAlbums) => {
                        if (listDeletedAlbums.length != 0) {
                            console.log('Los siguientes albums han sido borrados: ' + listDeletedAlbums);
                        }
                    })
            } else {
                console.log('El artista ' + artistId + ' no tiene albums asociados');
            }
        })
        .then(() => {
            Artist.findByIdAndRemove(artistId).exec()
                .then((removedArtist) => {
                    if (removedArtist) {
                        console.log('El siguiente artista ha sido borrado: ' + removedArtist);
                        res.status(200).send({
                            removedArtist: removedArtist,
                            removedAlbums: result[1],
                            removedSongs: result[2]
                        });
                    } else {
                        console.log('El artista: ' + artistId + ' no existe en BD');
                        res.status(200).send({ message: 'El artista con identificador ' + artistId + ' no existe en BD' });
                    }
                })
        })
        //Capturamos los errores en la petición
        .catch((err) => {
            res.status(500).send({ message: 'Error en la petición' });
        })
}

// Creamos la subida de avatar

function uploadImg(req, res){

	var ArtistId = req.params.id;
	var file_name = 'Imagen no subida';

	if(req.files){

		var file_path = req.files.image.path;
		var file_split = file_path.split('\/');
		var file_name = file_split[2]; // con un 2 no funciona 
		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if(file_ext == 'jpeg' || file_ext == 'png' || file_ext == 'gif' || file_ext == 'jpg'){

			Artist.findByIdAndUpdate(ArtistId, {image: file_name}, (err, ArtistUpdated) => {

			if(!ArtistUpdated){
			res.status(404).send({message: 'No se ha podido actualizar el avatar del usuario. Error del server'}); 
			}else{
			res.status(200).send({ image: file_name, user: ArtistUpdated});
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
	var pathFile = './upload/artists/'+imageFile;
	fs.exists(pathFile, function(exists){
		if(exists){
		res.sendFile(path.resolve(pathFile));
		} else{

		res.status(200).send({message : 'No existe la imagen'});

		}

	});
}


module.exports = {

	getArtist,
	SaveArtist,
	getArtists,
	DeleteArtist,
	getImageFile,
	uploadImg

}