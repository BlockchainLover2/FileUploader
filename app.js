const express = require('express')
const path = require("node:path");
const passport = require("passport")
const app = express()
const passportController = require("./controllers/PassportController")
const authRouter = require("./routes/authRouter")
const session = require("express-session");
require('dotenv').config()


const PORT = process.env.PORT ? process.env.PORT :3000



app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
const assetsPath = path.join(__dirname, "public");


app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended: true }));

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());

passport.use(passportController.localStrategy)

passport.serializeUser(passportController.serializeUser)


passport.deserializeUser(passportController.deserializeUser)

app.use("/auth",authRouter)


app.listen(PORT, ()=>{
    console.log("Listening on",PORT)
})

