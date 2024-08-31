const LocalStrategy = require("passport-local").Strategy
const query = require('../db/queries')
const bcrypt = require('bcryptjs')
const passport = require("passport");

const localStrategy = new LocalStrategy(async (username, password, done) => {
        try {
            const user = await query.getUserByUsername(username)
            if (!user) {
                return done(null, false, { message: "Incorrect username" });
            }
            const match = await bcrypt.compare(password,user.password)

            if (!match) {
                return done(null, false, { message: "Incorrect password" });
            }
            return done(null, user);

        } catch(err) {
            return done(err);
        }
    })


async function serializeUser(user, done){
    done(null, user.id);
}

async function deserializeUser(id, done){
    try {
        const user = await query.getUserById(id)
        done(null, user);
    } catch(err) {
        done(err);
    }
}

function logIn(req,res){
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/fail"
    })(req,res)
    res.cookie("hasLogged",true,{maxAge:1000*60*60})
}

module.exports = {
    localStrategy,
    serializeUser,
    deserializeUser,
    logIn
}

