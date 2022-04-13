const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('../models/Product');
const Product = mongoose.model('Product');
require('../models/Order');
const Order = mongoose.model('Order');
require('../models/User');
const User = mongoose.model('User');

router.get('/', (req, res) => {
    try{
        res.json({
            error: false,
            message: 'This is the back-end!'
        });
    }catch(err){
        res.json({
            error: true,
            message: err.message
        });
    }
});

router.get('/products/chairs', async (req, res) => {
    try {
        let chairProducts = await Product.find({
            department: 'chairs'
        }).lean();
        res.json({
            error: false,
            chairProducts
        });
    }catch {
        res.json({
            error: true,
            message: err.message
        })
    }
});

router.get('/products/desks', async (req, res) => {
    try {
        let deskProducts = await Product.find({
            department: 'desks'
        }).lean();
        res.json({
            error: false,
            deskProducts
        });
    }catch {
        res.json({
            error: true,
            message: err.message
        })
    }
});

router.get('/products/lighting', async (req, res) => {
    try {
        let lightingProducts = await Product.find({
            department: 'lighting'
        }).lean();
        res.json({
            error: false,
            lightingProducts
        });
    }catch {
        res.json({
            error: true,
            message: err.message
        })
    }
});

router.get('/products/', async (req, res) => {
    try {
        let products = await Product.find().lean();
        res.json({
            error: false,
            products
        });
    }catch {
        res.json({
            error: true,
            message: err.message
        })
    }
});

router.get('/product/:id', async (req, res) => {
    try {
        let product = await Product.findOne({
            _id: req.params.id
        });
        //console.log(JSON.stringify("PRODUCT: " + product));
        res.json({
            error: false,
            product
        });
    }catch {
        res.json({
            error: true,
            message: err.message
        })
    }
});

router.post('/purchase', async (req, res) => {
    // Todo: #### VALIDATE DATA
    var errors = [];
    try{
        const transaction = req.body;
        // Validation:
        if(!transaction.listproducts || transaction.listproducts.length ===0 || typeof transaction.listproducts == undefined || transaction.listproducts == null){
            console.log("No products on cart!");
            errors.push(
                "No products on cart!"
            );
        }
        if(!transaction.shipping.street|| typeof transaction.shipping.street == undefined || transaction.shipping.street == null){
            console.log("No street info found!");
            errors.push(
                "No street info found!"
            );
        }
        if(!transaction.shipping.number|| typeof transaction.shipping.number == undefined || transaction.shipping.number == null){
            console.log("No apt/number info found!");
            errors.push(
                "No apt/number info found!"
            );
        }
        if(!transaction.shipping.zip|| typeof transaction.shipping.zip == undefined || transaction.shipping.zip == null){
            console.log("No zip number info found!");
            errors.push(
                "No zip number info found!"
            );
        }
        if(!transaction.shipping.city|| typeof transaction.shipping.city == undefined || transaction.shipping.city == null){
            console.log("No city info found!");
            errors.push(
                "No city info found!"
            );
        }
        if(!transaction.shipping.state|| typeof transaction.shipping.state == undefined || transaction.shipping.state == null){
            console.log("No state info found!");
            errors.push(
                "No state info found!"
            );
        }
        if(!transaction.payment.cardNumber|| typeof transaction.payment.cardNumber == undefined || transaction.payment.cardNumber == null){
            console.log("Enter your card number.");
            errors.push(
                "Enter your card number!"
            );
        }
        if(!transaction.payment.goodThru|| typeof transaction.payment.goodThru == undefined || transaction.payment.goodThru == null){
            console.log("Enter your card expiration date.");
            errors.push(
                "Enter your card expiration date!"
            );
        }
        if(!transaction.payment.cvv|| typeof transaction.payment.cvv == undefined || transaction.payment.cvv == null){
            console.log("Enter your cvv.");
            errors.push(
                "Enter your cvv!"
            );
        }
        if(!transaction.payment.cardholder|| typeof transaction.payment.cardholder == undefined || transaction.payment.cardholder == null){
            console.log("Enter the cardholder's name.");
            errors.push(
                "Enter the cardholder's name!"
            );
        }
        if(!transaction.payment.id|| typeof transaction.payment.id == undefined || transaction.payment.id == null){
            console.log("Enter the cardholder's id.");
            errors.push(
                "Enter the cardholder's id!"
            );
        }

        // Checking for errors:
        if(errors.length > 0){
            //console.log(errors);
            res.json({
                error: true,
                message: errors
            });
        }else{
        
            new Order(transaction).save()
            .then(() => {
                console.log("Order sent with success!");
                res.json({
                    error: false,
                    message: "Order placed with success!"
                });
            }).catch((err) => {
                console.log("Purchase Error: " + err);
                res.json({
                    error: true,
                    message: err.message
                });
            })
        }
    }catch(err){
        res.json({
            error: true,
            message: err.message
        });
    }
});

router.post('/register', async (req, res) => {
    var errors = [];
    try{
        // Validation:
        if(!req.body.name|| typeof req.body.name == undefined || req.body.name == null){
            console.log("Error validating Name input");
            errors.push(
                "No name found!"
            );
        }
        if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
            console.log("Error validating Email input");
            errors.push(
                "No email found!"
            );
        }
        if(!req.body.password || typeof req.body.password == undefined || req.body.password == null){
            console.log("Error validating Password input");
            errors.push(
                "Choose a password!"
            );
        }
        if(!req.body.password2 || typeof req.body.password2 == undefined || req.body.password2 == null){
            console.log("Error validating Password 2 input");
            errors.push(
                "Please, repeat your password!"
            );
        }

        const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
        };
        if(validateEmail(req.body.email)){
            //console.log("Valid e-mail!");
        }else{
            console.log("E-mail invalid!");
            errors.push(
                "E-mail invalid!"
            );
        }

        const validatePassword = (password) => {
        return String(password)
            .match(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,20}$/
            );
        };
	    if(validatePassword(req.body.password)){
            //console.log("Valid password!");
        }else{
            console.log("Password invalid!");
            errors.push(
                "Password invalid! Please review the rules and try again."
            );
        }
        if(req.body.password != req.body.password2){
            console.log("Passwords don't match");
            errors.push(
                "Passwords don't match!"
            );
        }

        // Checking for errors:
        if(errors.length > 0){
            //console.log(errors);
            res.json({
                error: true,
                message: errors
            });
        }else{
            User.findOne({
                email: req.body.email
            }).then((user) => {
                if(user) {
                    errors.push(
                        "This e-mail is already in use!"
                    );
                    res.json({
                        error: true,
                        message: errors
                    });
                }else {
                    const user = req.body;
                    const newUser = new User(user);
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err){
                                errors.push(
                                    err
                                );
                                res.json({
                                    error: true,
                                    message: errors
                                });
                            }else {
                                newUser.password = hash;
                                newUser.save()
                                .then(() => {
                                    console.log("User registered!");
                                    res.json({
                                        error: false,
                                        message: "You've been registered with success."
                                    });
                                }).catch((err) => {
                                    console.log("User Registration Error: " + err);
                                    errors.push(
                                        err.message
                                    );
                                    res.json({
                                        error: true,
                                        message: errors
                                    });
                                });
                            }
                        })
                    });
                }
            })            
        } 
    }catch(err){
        errors.push(
            err.message
        );
        res.json({
            error: true,
            message: errors
        });
    }
});

module.exports = router;