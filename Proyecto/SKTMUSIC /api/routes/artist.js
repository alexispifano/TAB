'use strict'

var express = require('express');
var ArtistController = require('../controllers/artist');
var md_auth = require('../middlewares/authenticated'); 
var api = express.Router();

var multiparty = require('connect-multiparty');
var md_upload = multiparty({uploadDir: './upload/artists'});


// carga de rutas

api.get('/artist/:id', md_auth.ensureAuth, ArtistController.getArtist);
api.post('/save-artist', md_auth.ensureAuth, ArtistController.SaveArtist);
api.get('/artists/:page?', md_auth.ensureAuth, ArtistController.getArtists);
api.delete('/artist/:id', md_auth.ensureAuth, ArtistController.DeleteArtist);
api.post('/upload-image-artist/:id',[md_auth.ensureAuth, md_upload], ArtistController.uploadImg);
api.get('/get-image-artist/:imageFile', ArtistController.getImageFile);

module.exports = api;