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
        const { rows } = await query.getUserById(id)
        const user = rows[0];

        done(null, user);
    } catch(err) {
        done(err);
    }
}

const logIn = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"

})

module.exports = {
    localStrategy,
    serializeUser,
    deserializeUser,
    logIn
}

