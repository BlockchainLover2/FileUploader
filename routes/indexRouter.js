const express = require('express')
const indexRouter = express.Router()
const folderController = require('../controllers/FolderController')
const multer = require("multer");
const upload = multer({ dest: 'uploads/' })


indexRouter.get("/favicon.ico/",()=>{})


indexRouter.get("/share/:id([a-zA-Z0-9-]+)/?*",folderController.getAllFoldersAndFilesByShareLink)

indexRouter.get("/?*/create-folder",folderController.createFolderGet)
indexRouter.post("/?*/create-folder",folderController.createFolderPost)

indexRouter.post("/?*/create-file",upload.single("file"),folderController.uploadFilePost)

indexRouter.get("/*/",folderController.getAllFoldersAndFiles)





module.exports = indexRouter