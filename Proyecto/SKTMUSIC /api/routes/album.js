
var express = require('express');
var AlbumController = require('../controllers/album');
var md_auth = require('../middlewares/authenticated'); 
var api = express.Router();

var multiparty = require('connect-multiparty');
var md_upload = multiparty({uploadDir: './upload/album'});


// carga de rutas

api.post('/save-album', md_auth.ensureAuth, AlbumController.SaveAlbum);
api.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.get('/albums/:artist?', md_auth.ensureAuth, AlbumController.getAlbums);
api.put('/album/:id', md_auth.ensureAuth, AlbumController.updateAlbum);
api.delete('/album/:id', md_auth.ensureAuth, AlbumController.DeleteAlbum);
api.post('/upload-image-albums/:id',[md_auth.ensureAuth, md_upload], AlbumController.uploadImg);
api.get('/get-image-albums/:imageFile', AlbumController.getImageFile);


module.exports = api;