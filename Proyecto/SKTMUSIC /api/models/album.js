'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var AlbumSchema = Schema({
	title: String,
	description: String,
	year: Number,
	image: String,
	Artist: { type: Schema.ObjectId, ref: 'Artist'} // Interactuamos con otro modelo tipo Schema.

});

module.exports = mongoose.model('Album', AlbumSchema);