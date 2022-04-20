const express = require('express');
const router = express.Router();

const passport = require('passport');

const mongoose = require('mongoose');
require('../models/Order');
const Order = mongoose.model('Order');
require('../models/User');
const User = mongoose.model('User');
require('../models/OldOrder');
const OldOrder = mongoose.model('OldOrder');

router.get('/', (req, res) => {
	try{
        res.json({
            error: false,
            message: 'User routes.'
        });
    }catch(err){
        res.json({
            error: true,
            message: err.message
        });
    }
});

router.get('/404', (req, res) => {
    res.json({
        error: true,
        message: "Error 404!"
    });
});

router.get('/orders/:id', async (req, res) => {
    //console.log("Inside /user/orders!");
    //console.log("req.params.id: ", req.params.id);
    try {
        let user = await User.findOne({
            _id: req.params.id
        });
        //console.log("User found, email: ", user.email);
        let orders = await Order.find({
            'customer.email': user.email 
        }).lean();
        res.json({
            error: false,
            orders
        });
    }catch {
        res.json({
            error: true,
            message: err.message
        })
    }  
});

router.get('/orders/history/:id', async (req, res) => {
    try {
        let user = await User.findOne({
            _id: req.params.id
        });
        let orders = await OldOrder.find({
            'customer.email': user.email 
        }).lean();
        res.json({
            error: false,
            orders
        });
    }catch {
        res.json({
            error: true,
            message: err.message
        })
    }
    
});

router.post('/login', async (req, res, next) => {
    /*
    console.log("Inside POST route /user/login, Req.body: " + JSON.stringify(req.body));
    console.log("User: " + req.body.email);
    console.log("Password: " + req.body.password);
    console.log("_____________________________________");
    */
    try{
        passport.authenticate('local', (err, user, info) => {
            if(!user) {
                res.json({
                    error: true,
                    message: "No user found with this e-mail!",
                    isAuthenticated: req.isAuthenticated()
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
                    /*
                    //res.cookie('userid', user.id, { maxAge: 1 * 60 * 60 * 1000 });  // Expires in and hour
                    console.log("Inside 'post' /user/login -> passport.authenticate");
                    //console.log("user.id: " + user.id);
                    //console.log("info: ", info);
                    //console.log("user: ", user);
                    console.log("req.user: ", req.user);
                    console.log("isAthenticated: " + req.isAuthenticated());
                    console.log("____________________________________________________");
                    */
                    res.json({
                        error: false,
                        message: "User logged-in with success!",
                        userID: req.user.id,
                        userName: req.user.name,
                        userEmail: req.user.email,
                        userIsAdmin: req.user.isAdmin,
                        isAuthenticated: req.isAuthenticated()
                    });
                    next();
                    
                    //console.log("Inside passport.authenticate, req.user: " + req.user);
                });
                console.log("### AFTER req.login isAthenticated: " + req.isAuthenticated());
                console.log("____________________________________________________");
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

router.get('/logout', (req, res) => {
	req.logout();
    console.log("User logged-out");
    res.json({
        error: false,
        message: "You logged-out!",
        isAuthenticated: req.isAuthenticated()
    });
});

module.exports = router;