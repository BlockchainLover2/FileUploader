const query = require("../db/queries")
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs')
const passport = require('passport');
const {logIn} = require("./PassportController");
const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";
const crypto = require('crypto');


const validateUser = [
    body("username").trim()
        .isAlpha().withMessage(`First name ${alphaErr}`)
        .isLength({ min: 1, max: 10 }).withMessage(`First name ${lengthErr}`),
    body("password").trim().isLength({ min: 1, max: 10 }).withMessage(`Password ${lengthErr}`),
];

exports.createUserGet = (req,res)=>{
    res.render("createUserForm")
}

exports.createUserPost = [validateUser, async (req,res,next)=>{
    if(!errorHandler(req,res)) return
    try {
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            if(err) return next(err);
            req.body.password = hashedPassword
            await query.createUser(req.body);
            res.redirect("/");
        });

    } catch(err) {
        return next(err);
    }
}]


exports.loginGet = (req,res)=>{
    res.render("loginForm")
}

exports.loginPost = logIn


exports.createShareLink = async (res,req)=>{
    const dateObj = new Date()
    dateObj.setHours(dateObj.getHours() + 6)

    const linkData = {
        ownedUser: res.user.id,
        expiredAt: dateObj
    }
    const newShareLink = await query.createShareLink(linkData)
    req.redirect("/")
}

exports.logoutPost = (req,res,next)=>{
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
}




function errorHandler(req,res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send(errors)
        return false
    }
    return true
}