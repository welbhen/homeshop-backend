// Imports:
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const session = require('express-session');
//const MongoStore = require('connect-mongo');
const passport = require('passport');
require("./auth")(passport);

// Config .env
    const path = require('path');
    const dotenv = require('dotenv');
    dotenv.config({ path: path.resolve(__dirname, '../.env')});

require('./database');

// Middlewares:
    // Session:    
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

// Server:
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
        console.log("Env: " + process.env.NODE_ENV);
        console.log("Server opened! Port: " + PORT);
    });