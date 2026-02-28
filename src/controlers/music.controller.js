const musicModel = require("../models/music.model");
const jwt = require("jsonwebtoken");
const albumModel = require("../models/album.model");
const { uploadFile } = require("../services/storage.service");

async function createMusic(req, res) {
  const { title } = req.body;
  const file = req.file;

  const result = await uploadFile(file.buffer.toString("base64"));
  const music = await musicModel.create({
    uri: result.url,
    title,
    artist: req.user.id,
  });

  res.status(201).json({
    message: "Music created successfully",
    music: {
      id: music._id,
      uri: music.uri,
      title: music.title,
      artist: music.artist,
    },
  });
}

async function creaeteAlbum(req, res) {
  const { title, musics, } = req.body;

  const album = await albumModel.create({
    title,
    artist: req.user.id,
    musics: musics,
  });

  res.status(201).json({
    message: "album created successfully",
    album: {
      id: album._id,
      title: album.title,
      artist: req.user.id,
      musics: album.musics,
    },
  });
}

async function fetchMusic(req,res) {

const musics = await musicModel.find().limit(2).populate('artist',"username") 

  res.status(200).json({
    message:"fetched!",
    musics
  })
  
}

async function getAllAlbums(req,res) {

  const albums = await albumModel.find().select("title artist").populate("artist","username")
  res.status(200).json({
    message:"albums fetched!",
    albums:albums
  })
  
}
async function getAlbumById(req,res) {
  const { id } = req.params
  const album = await albumModel.findById(id).populate("artist","username").populate("music")
  res.status(200).json({
    message:"album fetched by ID",
    album
  })
  
}
module.exports = {
  createMusic,
  creaeteAlbum,
  fetchMusic,
  getAllAlbums,
  getAlbumById
};
