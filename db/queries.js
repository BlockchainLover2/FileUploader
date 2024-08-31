

// instantiate the client
const { PrismaClient } = require('@prisma/client');
const {data} = require("express-session/session/cookie");
const prisma = new PrismaClient();


async function createUser(user){
    await prisma.users.create({
        data:user
    })
}
async function getUserById(id){
    return prisma.users.findFirst({where: {id: id}});
}

async function getUserByUsername(username) {
    return prisma.users.findFirst({where: {username: username}});
}
async function getFoldersByFilter(filter, user, path){
    if(user === undefined)
        return
    const parentfolder = await getFolderByPath(path);
    const parentfolderid = parentfolder === null || parentfolder === undefined ? null:parentfolder.id
    return prisma.folders.findMany({where: {
        name: {contains:`${filter}`},
            userid:user,
            parentfolderid:parentfolderid
    },

    })
}


async function removeExpiredLinks(){
    await prisma.sharelinks.deleteMany({where:{
        expiredAt: {lte:new Date()}
        }})
}

async function getFilesByFilter(filter, user, path){
    if(user === undefined)
        return

    const parentfolder = await getFolderByPath(path);
    const parentfolderid = parentfolder === null || parentfolder === undefined ? null:parentfolder.id
    return prisma.files.findMany({where: {
            name: {contains:`${filter}`},
            userid:user.id,
            parentfolderid:parentfolderid
        },

    })
}
async function createFolder(folder){
    try{
        await prisma.folders.create({
            data: folder
        })
    }
    catch (e){
        console.error(e)
    }

}

async function createFile(file){
    try{
        await prisma.files.create({
            data: file
        })
    }
    catch (e){
        console.error(e)
    }

}

async function createShareLink(linkData){
    try{
        return await prisma.sharelinks.create({
            data:linkData
        })
    }
    catch (e){
        console.error(e)
    }

}

async function getFolderByPath(path){
    if(path === "/")
        return
    return prisma.folders.findFirst({where: {
        path:path
        }})
}

async function getSharedLink(id){

    return prisma.sharelinks.findFirst({where: {
        id:id
        }})
}

module.exports = {
    createUser,
    getUserById,
    getUserByUsername,
    getFoldersByFilter,
    createFolder,
    getFolderByPath,
    createFile,
    getFilesByFilter,
    createShareLink,
    getSharedLink,
    removeExpiredLinks
}


