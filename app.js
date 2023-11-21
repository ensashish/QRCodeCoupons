import express from 'express';
import bp from 'body-parser';
import couponRouter from './routes/coupon.js';
import dotenv from 'dotenv';
import dbConnection from './utils/dbConnect.js';
import passport from 'passport';
import {authTodo} from './auth.js';
import session from 'express-session';

const app = express();
dotenv.config();
dbConnection();
authTodo();
app.set("view engine", "ejs");
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());

function isLoggedIn (req, res, next){
    req.user ? next() :res.sendStatus(401);
}

app.get("/", (req, res) => {
    res.render("index");
});

app.use(session({
    secret : 'secretKey',
    resave: false,
    saveUninitialized:true,
    cookie : {secure:false}
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));

app.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/auth/google/success',
        failureRedirect: '/auth/google/failure'
}));

app.get("/auth/google/success", isLoggedIn, (req, res) => {
    console.log("Google Data of user ::>> ",req.user);
    res.render("QRGenerator");
});

app.get("/auth/google/failure", (req, res) => {
    res.render("Something went wrong...!");
});

app.get("/auth/logout", (req, res) => {
    req.session.destroy();
    res.send("You are logout successfully ...!");
});

// app.get("/qr-code-generator", (req, res) => {
//     res.render("QRGenerator");
// });

app.use('/coupon', couponRouter);

const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Server is running at PORT : ${PORT}`)
});