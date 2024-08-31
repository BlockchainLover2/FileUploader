const query = require("../db/queries")
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs')
const passport = require('passport');
const {logIn} = require("./PassportController");
const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";
const cloudinary = require("cloudinary").v2




exports.getAllFoldersAndFiles = async (req, res)=>{
    const data = await getAllData(req,res,req.user?.id)
    res.render("index",{folders:data.array,currentPath:data.pathParam,user:req.user})

}

exports.getAllFoldersAndFilesByShareLink = async (req, res)=>{
    const sharedLinkId = req.params.id
    const shareLinkFound = await query.getSharedLink(sharedLinkId);
    if(shareLinkFound){
        const data = await getAllData(req,res,shareLinkFound.ownedUser)
        res.render("index",{folders:data.array,currentPath:req.url+data.pathParam})
    }
    else{
        res.redirect("")
    }

}

async function getAllData(req,res,userid){
    let currentFolder = req.params[0]
    if(currentFolder?.endsWith("/"))
        currentFolder = currentFolder.substring(0,currentFolder.length-2);
    let array;
    const folders = await query.getFoldersByFilter("",userid,"/"+currentFolder)
    const files = await query.getFilesByFilter("",userid,"/"+currentFolder)
    const pathParam = currentFolder === "" ? "" : "/"+currentFolder
    array = files?.concat(folders)


    return {array,pathParam}
}


exports.createFolderGet = async (req,res)=>{
    res.render("createFolderForm")
}

exports.createFolderPost = async (req,res)=>{
    let path = req.params[0] === ""? "":"/"+req.params[0]
    const parentFolder = await query.getFolderByPath(path)
    const folderObject= {
        name:req.body.name,
        userid: req.user.id,
        parentfolderid: parentFolder?.id,
        path:path + "/"+req.body.name
    }
    await query.createFolder(folderObject)
    path = path === ""?"/":path;
    res.redirect(path);
}

exports.uploadFilePost = async (req,res)=>{

    // Configuration
    cloudinary.config({
        cloud_name: process.env["CloudinaryCloudName"],
        api_key: process.env["CloudinaryAPIKey"],
        api_secret: process.env["CloudinaryAPISecret"] // Click 'View API Keys' above to copy your API secret
    });


    if(req.file === undefined){
        res.redirect("/"+req.params[0])
        return
    }

    // Upload an image
    const uploadResult = await cloudinary.uploader
        .upload(
            req.file.path, {
                public_id: req.file.name,
            }
        )
        .catch((error) => {
            console.log(error);
        });


    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url('file', {
        fetch_format: 'auto',
        quality: 'auto'
    });


    // Transform the image: auto-crop to square aspect_ratio
    const autoCropUrl = cloudinary.url('file', {
        crop: 'auto',
        gravity: 'auto',
        width: 500,
        height: 500,
    });


    const path = req.params[0] === ""? "":"/"+req.params[0]
    const parentFolder = await query.getFolderByPath(path)
    const fileObject= {
        name:req.file.originalname,
        userid: req.user.id,
        parentfolderid: parentFolder?.id,
        path:path + "/"+req.file.originalname,
        url: uploadResult.url,
        size:uploadResult.bytes * Math.pow(10,-6) + " MB"


    }

    await query.createFile(fileObject);


    res.redirect("/"+req.params[0])

}


function errorHandler(req,res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send(errors)
        return false
    }
    return true
}