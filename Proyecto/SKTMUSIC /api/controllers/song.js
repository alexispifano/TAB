'use strict'

var path = require('path');
var fs = require('fs');
var mongoosepaginate = require('mongoose-pagination');

var Album = require('../models/album');
var Artist = require('../models/artist');
var Song = require('../models/song');

function getSong (req, res){

var songId = req.params.id;

Song.findById(songId).populate({path: 'album'}).exec((err, song) =>{

	if(err){

		res.status(500).send({message: 'Error en la petición'});

	}else{
		if(!song){

			res.status(404).send({message: ' La canción no existe'});
		} else {

			res.status(200).send({song});

		}

	}

});

}

function getSongs ( req, res ) {

	var albumId = req.params.album;

	if (!albumId){
		var find = Song.find({}).sort('number');
	}else{

		var find = Song.find({album: albumId}).sort('number');
	}

	find.populate({

		path: 'album',
		populate: {
			path: 'Artist',
			model: 'Artist'
		}
		

	}).exec((err, songs)=>{

		if(err){
		
		res.status(500).send({message: 'Error en la petición'});

		} else {
			if(!songs) {

		res.status(404).send({message: 'No hay canciones disponibles'});

			}else {

				res.status(200).send({songs});

			}
		}

	});

}


function saveSong (req, res) {

	var song = new Song();
	var params = req.body;
	song.number = params.number;
	song.name = params.name;
	song.duration = params.duration;
	song.file = null;
	song.album = params.album;

	song.save((err, songsaved)=>{

		if(err) {

			res.status(500).send({message: ' Error en la petición al servidor'});
		} else {

			if(!songsaved)
			res.status(404).send({message: ' No se ha guardado la canción. Error interno'});
			else{

			res.status(200).send({Song: songsaved});
			}

		}

	});
}


function updateSong(req, res){

		var songId = req.params.id;
		var update = req.body;

		Song.findByIdAndUpdate(songId, update, (err, songupdate)=>{

			if(err){

				res.status(500).send({message: 'Error en la petición al servidor'});

			}else{

				if(!songupdate){

						res.status(404).send({message: 'No se ha actualizado la canción'});

				}else{

					res.status(200).send({Song: songupdate});

				}


			}

		});
}

function removesong (req, res) {

	var songId = req.params.id;

	Song.findByIdAndRemove(songId, (err, songdeleted)=>{

			if(err){

				res.status(500).send({message: 'Error en la petición al servidor'});

			}else{

				if(!songupdate){

						res.status(404).send({message: 'No se ha eliminado la canción o ya ha sido eliminada'});

				}else{

					res.status(200).send({Song: songdeleted});

				}


			}

	});

}


function uploadSong(req, res){

	var SongId = req.params.id;
	var file_name = 'Canción no subida';

	if(req.files){

		var file_path = req.files.file.path;
		var file_split = file_path.split('\/');
		var file_name = file_split[2];
		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if(file_ext == 'mp3' ){

			Song.findByIdAndUpdate(SongId, {file: file_name}, (err, SongUpdate) => {

			if(!SongUpdate){
			res.status(404).send({message: 'No se ha podido actualizar la pista de audio.'}); 
			}else{
			res.status(200).send({song: SongUpdate});
			}
			
		});

		}else{
			res.status(200).send({message: 'Archivo no válido. solo mp3'});
		}
		
	}else {
		res.status(200).send({message : 'No has subido ninguna canción'});
	}
}

function getSongFile(req, res){

	var imageFile = req.params.songFile;
	var pathFile = './upload/songs/' +imageFile;
	fs.exists(pathFile, function(exists){
		if(exists){
		res.sendFile(path.resolve(pathFile));
		} else{

		res.status(200).send({message : 'No existe la canción'});

		}

	});
}

module.exports = {
	getSong,
	getSongs,
	saveSong,
	updateSong,
	removesong,
	uploadSong,
	getSongFile

}