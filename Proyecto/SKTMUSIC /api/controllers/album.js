'use strict'

var path = require('path');
var fs = require('fs');
var mongoosepaginate = require('mongoose-pagination');

var Album = require('../models/album');
var Artist = require('../models/artist');
var Song = require('../models/song');


//Guarda el album y lo asocia a un artista
function SaveAlbum (req, res) {

	var album = new Album();

	var params = req.body;
	album.title = params.title;
	album.description = params.description; 
	album.year = params.year;
	album.image = 'null';
	album.Artist = params.Artist;

	album.save((err, AlbumStored) => {

		if(err){
			res.status(500).send({message: ' Error en la petición del servidor'});
		}else{
			if(!AlbumStored)
				res.status(200).send({message: 'Error al guardar el album' });
			else{

				res.status(200).send({album: AlbumStored});
			}
		}


	});

}

function getAlbums (req, res){

	var ArtistId = req.params.Artist;

	if(!ArtistId) {

		var find = Album.find({}).sort('title');

	}else{
		var find = Album.find({Artist: ArtistId}).sort('year');
	}

	find.populate({path: 'Artist'}).exec((err, albums) =>{

		if(err){

			res.status(500).send({message: 'error en la petición al servidor'});

		}else{
			if(!albums) {

				res.status(404).send({message: 'No hay Albums '});
			} else {

				res.status(200).send({albums});
			}
		}
	})

}

function getAlbum(req, res){

	var albumId = req.params.id;

	Album.findById(albumId).populate({path: 'Artist'}).exec((err, album)=>{

		if(err){
			res.status(500).send({message: 'error en la petición al servidor'});
		}else{
			if(!album){
				res.status(404).send({message: 'error en exportar el album. No existe o ha sido eliminado'});
			}else{
			res.status(200).send({album});
		}
	}

	});

}

function updateAlbum(req, res){

	var albumId = req.params.id;
	var update = req.body;

	Album.findByIdAndUpdate(albumId, update, (err, albumupdate) =>{

		if(err){

				res.status(500).send({message: 'error en la petición al servidor'});

		}else{

			if(!albumupdate){

				res.status(404).send({message: 'No existe o ha sido eliminado'});

			}else{

				res.status(200).send({albumupdate});
			}
		}


	});

}


function DeleteAlbum (req, res){
    var AlbumId = req.params.id;
    //Almacenamos los listados de los documents a borrar
    //[0] = Artista   [1] = Albums   [2] = Canciones
    var result = [];
    result[0] = AlbumId;
    //Buscamos los albums del Artista
    Album.find({ Album: AlbumId }).exec()
        .then((albums) => {
            //Guardamos los albums encontrados
            result[1] = albums;
            var songsQueries = [];
            //Buscamos las canciones de cada album del Artista
            albums.forEach((album) => {
                var promiseSong = Song.find({ Album: album }).exec()
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
                res.status(404).send({message: 'El album ' + AlbumId + ' no tiene canciones asociadas'});
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
                console.log('El artista ' + AlbumId + ' no tiene albums asociados');
            }
        })
        .then(() => {
            Album.findByIdAndRemove(AlbumId).exec()
                .then((removedArtist) => {
                    if (removedArtist) {
                        console.log('El siguiente artista ha sido borrado: ' + removedArtist);
                        res.status(200).send({
                            removedArtist: removedArtist,
                            removedAlbums: result[1],
                            removedSongs: result[2]
                        });
                    } else {
                        console.log('El artista: ' + AlbumId + ' no existe en BD');
                        res.status(200).send({ message: 'El artista con identificador ' + AlbumId + ' no existe en BD' });
                    }
                })
        })
        //Capturamos los errores en la petición
        .catch((err) => {
            res.status(500).send({ message: 'Error en la petición' });
        })
}

// subida de imagen

function uploadImg(req, res){

	var AlbumId = req.params.id;
	var file_name = 'Imagen no subida';

	if(req.files){

		var file_path = req.files.image.path;
		var file_split = file_path.split('\/');
		var file_name = file_split[2];
		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if(file_ext == 'jpeg' || file_ext == 'png' || file_ext == 'gif' || file_ext == 'jpg'){

			Album.findByIdAndUpdate(AlbumId, {image: file_name}, (err, AlbumUpdate) => {

			if(!AlbumUpdate){
			res.status(404).send({message: 'No se ha podido actualizar el avatar del usuario. Error del server'}); 
			}else{
			res.status(200).send({image: file_name, Album: AlbumUpdate});
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
	var pathFile = './upload/album/' +imageFile;
	fs.exists(pathFile, function(exists){
		if(exists){
		res.sendFile(path.resolve(pathFile));
		} else{

		res.status(200).send({message : 'No existe la imagen'});

		}

	});
}

module.exports = {

	SaveAlbum,
	getAlbum,
	getAlbums,
	updateAlbum,
	DeleteAlbum,
	uploadImg,
	getImageFile,
	

}