const express = require('express')
const path = require("node:path");
const passport = require("passport")
const app = express()
const passportController = require("./controllers/PassportController")
const authRouter = require("./routes/authRouter")
const session = require("express-session");
const {PrismaClient} = require("@prisma/client");
const {PrismaSessionStore} = require("@quixo3/prisma-session-store");
const cookieParser = require("cookie-parser");
const indexRouter = require("./routes/indexRouter");
require('dotenv').config()
const cron = require("node-cron")
const query = require("./db/queries")
const {get} = require("node:http");
const PORT = process.env.PORT ? process.env.PORT :3000



app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
const assetsPath = path.join(__dirname, "public");


app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser());

cron.schedule("* * * * *",async ()=>{
    await query.removeExpiredLinks()
})


app.use((req,res,next) => {
    next()
})

app.use(
    session({
        cookie: {
            maxAge:  24*60*60 * 1000 ,
        },
        secret: 'a santa at nasa',
        resave: true,
        saveUninitialized: true,
        store: new PrismaSessionStore(
            new PrismaClient(),
            {
                checkPeriod: 2 * 60 * 1000,  //ms
                dbRecordIdIsSessionId: true,
                dbRecordIdFunction: undefined,
            }

            
        )
    })
);

app.use(passport.session());



app.use((req,res,next)=>{
    res.locals.user = req.user;
    res.locals.hasLoggedBefore = req.cookies.hasLogged
    next()
})


passport.use(passportController.localStrategy)

passport.serializeUser(passportController.serializeUser)



passport.deserializeUser(passportController.deserializeUser)

app.use("/auth",authRouter)
app.use("/",indexRouter)

app.listen(PORT, ()=>{
    console.log("Listening on",PORT)
})

