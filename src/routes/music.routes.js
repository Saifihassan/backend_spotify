const express = require('express')
const musicController = require('../controlers/music.controller')
const multer = require('multer')
const authMiddleware =require("../middlewares/auth.middleware")
const router = express.Router()

const upload = multer({
    storage:multer.memoryStorage()
})

router.post('/upload',authMiddleware.authArtist,upload.single('music'),musicController.createMusic)
router.post("/album",authMiddleware.authArtist,musicController.creaeteAlbum)
router.get("/",authMiddleware.authUser,musicController.fetchMusic)
router.get("/album",authMiddleware.authUser,musicController.getAllAlbums)
router.get("/albums/:albumId",authMiddleware.authUser,musicController.getAlbumById)
module.exports=router