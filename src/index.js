// Imports:
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const session = require('express-session');
const cookieParser = require('cookie-parser');
//const bodyParser = require('body-parser');
//const mongoose = require('mongoose');
//const MongoStore = require('connect-mongo');
//const cookieSession = require('cookie-session');
const passport = require('passport');
require("./auth")(passport);
// Config .env
    const path = require('path');
    const dotenv = require('dotenv');
    dotenv.config({ path: path.resolve(__dirname, '../.env')});

require('./database');

// Middlewares:
    // Session:
    //app.use(cookieParser("password"));
    /*
    app.use(cookieSession({
        name: "session",
        keys: ["password"],
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    }));
    */
    
    app.use(session({
        secret: "password",
        resave: true,
        saveUninitialized: true,
        cookie: {
            secure: false,
            maxAge: 1 * 60 * 60 * 1000, // 1 hour(s)
        },
        /*
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URL,
        })
        */
    }));
    
    app.use(passport.initialize());
    app.use(passport.session());

    /*
    app.use((req, res, next) => {
        res.locals.user = req.user || null;
        console.log("### Middleware running!");
        console.log("res.locals.user: " + res.locals.user);
        console.log("req.user: " + req.user);
        console.log("req.sessionID: ", req.sessionID);
        console.log("isAthenticated: " + req.isAuthenticated());
        console.log("___________________________________________________");
        return next();
    });
    */

// Other Configs:
    app.use(cors({ 
        Origin: process.env.FRONT_END_URL,
        methods: "GET,POST,PUT,DELETE",
        credentials: true
    }));
    app.use(morgan('dev'));
    app.use(express.json());
    app.use(express.urlencoded({
        extended: false
    }));
    
    
// Routes:
    app.use('/', require('./routes/main.routes'));
    app.use('/admin', require('./routes/admin.routes'));
    app.use('/user', require('./routes/user.routes'));

/* #################### NEW - for test purposes*/
app.post('/login-TEST', async (req, res, next) => {
    console.log("Inside POST route /user/login, Req.body: " + req.body);
    console.log("User: " + req.body.email);
    console.log("Password: " + req.body.password);
    console.log("_____________________________________");
    try{
        passport.authenticate('local', (err, user, info) => {
            if(!user) {
                res.json({
                    error: true,
                    message: "No user found with this e-mail!"
                });
            }else {
                req.logIn(user, err => {
                    if(err){
                        console.log("Error inside req.logIn on user.routes: " + err);
                        return next(err);
                        /*
                        res.json({
                            error: true,
                            message: "An error occured!"
                        });
                        */
                    }
                    //res.cookie('userid', user.id, { maxAge: 1 * 60 * 60 * 1000 });  // Expires in and hour
                    console.log("Inside 'post' /user/login -> passport.authenticate");
                    console.log("user.id: " + user.id);
                    console.log("info: ", info);
                    console.log("user: ", user);
                    console.log("req.user: ", req.user);
                    console.log("isAthenticated: " + req.isAuthenticated());
                    console.log("____________________________________________________");
                    
                    res.json({
                        error: false,
                        message: "User logged-in with success!",
                        user
                    });
                    //next();
                    
                    //console.log("Inside passport.authenticate, req.user: " + req.user);
                });
            }
        })(req, res, next);
        /*
        console.log("After passport.authenticate");
        console.log("#################### req.user: ", req.user);
        console.log("#################### req.email: ", req.email);
        //console.log("#################### res: ", res);
        console.log("____________________________________________________");
        */
    }catch(err){
        res.json({
            error: true,
            message: err.message
        });
    }
	
});
/* ########################## for test purposes*/

// Server:
    app.set('port', process.env.PORT || 8000);
    app.listen(app.get('port'), () => {
        console.log("Env: " + process.env.NODE_ENV);
        console.log("Server opened!");
    });