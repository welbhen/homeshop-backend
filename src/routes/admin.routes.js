const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
require('../models/Product');
const Product = mongoose.model('Product');
require('../models/Order');
const Order = mongoose.model('Order');
require('../models/OldOrder');
const OldOrder = mongoose.model('OldOrder');

router.get('/', (req, res) => {
	try{
        res.json({
            error: false,
            message: 'Admin routes.'
        });
    }catch(err){
        res.json({
            error: true,
            message: err.message
        });
    }
});

router.get('/stock', async (req, res) => {
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

router.post('/stock/delete', async (req, res) => {
    const product = req.body;
    //console.log("Product: " + JSON.stringify(product));
    //console.log("Product ID to be deleted: " + product.id);
	Product.deleteOne({
		_id: product.id
	}).then(() => {
		console.log("Product deleted.");
        res.json({
            error: false,
            message: "Product deleted."
        });
	}).catch((err) => {
        console.log("Failed deleting product!");
        res.json({
            error: true,
            message: "Failed deleting product!"
        });
	});
});

router.post('/stock/quantity/add', async (req, res) => {
    Product.findOne({
		_id: req.body.id
	}).then((product) => {
        product.quantity = ((product.quantity) + 1);        
        product.save()
        .then(() => {
            console.log("Product quantity changed - added 1 unit.");
            res.json({
                error: false,
                message: "Product quantity changed - added 1 unit."
            });
        }).catch((err) => {
            console.log("Failed changing product quantity!");
            res.json({
                error: true,
                message: "Failed changing product quantity!"
            });
        });

    }).catch((err) => {
        console.log("Ooops! Failed changing product quantity!");
        res.json({
            error: true,
            message: "Ooops! Failed changing product quantity!"
        });
	});
});

router.post('/stock/quantity/sub', async (req, res) => {
    Product.findOne({
		_id: req.body.id
	}).then((product) => {
        if((product.quantity) > 0){
            product.quantity = ((product.quantity) - 1);        
            product.save()
            .then(() => {
                console.log("Product quantity changed - subtracted 1 unit.");
                res.json({
                    error: false,
                    message: "Product quantity changed - subtracted 1 unit."
                });
            }).catch((err) => {
                console.log("Failed changing product quantity!");
                res.json({
                    error: true,
                    message: "Failed changing product quantity!"
                });
            });
        }else{
            console.log("Cannot sub product quantity, it is already sold out!");
                res.json({
                    error: true,
                    message: "Cannot sub product quantity, it is already sold out!"
                });
        }

    }).catch((err) => {
        console.log("Ooops! Failed changing product quantity!");
        res.json({
            error: true,
            message: "Ooops! Failed changing product quantity!"
        });
	});
});

router.post('/stock/add', async (req, res) => {
    try{
        var errors = [];
        if(!req.body.name|| typeof req.body.name == undefined || req.body.name == null){
            console.log("Error validating Name input");
            errors.push(
                "No name found!"
            );
        }
        if(!req.body.department || typeof req.body.department == undefined || req.body.department == null){
            console.log("Error validating Department input");
            errors.push(
                "No department found!"
            );
        }
        if(!req.body.description || typeof req.body.description == undefined || req.body.description == null){
            console.log("Error validating Description input");
            errors.push(
                "No description found!"
            );
        }
        if(!req.body.price || typeof req.body.price == undefined || req.body.price == null){
            console.log("Error validating Price input");
            errors.push(
                "No price found!"
            );
        }
        if(!req.body.additionalInfo || typeof req.body.additionalInfo == undefined || req.body.additionalInfo == null){
            console.log("Error validating Additional Info input");
            errors.push(
                "No additional info found!"
            );
        }
        if(!req.body.price || typeof req.body.price == undefined || req.body.price == null){
            console.log("Error validating Price input");
            errors.push(
                "No price found!"
            );
        }
        if(!req.body.quantity || typeof req.body.quantity == undefined || req.body.quantity == null){
            console.log("Error validating product quantity Info input");
            errors.push(
                "No product quantity found!"
            );
        }
        if(!req.body.img1 || typeof req.body.img1 == undefined || req.body.img1 == null){
            console.log("Error validating img1 Info input");
            errors.push(
                "No Image 1 URL found!"
            );
        }
        if(!req.body.img2 || typeof req.body.img2 == undefined || req.body.img2 == null){
            console.log("Error validating img2 Info input");
            errors.push(
                "No Image 2 URL found!"
            );
        }
        if(!req.body.img3 || typeof req.body.img3 == undefined || req.body.img3 == null){
            console.log("Error validating img3 Info input");
            errors.push(
                "No Image 3 URL found!"
            );
        }

        // Checking for errors:
        if(errors.length > 0){
            //console.log(errors);
            errors.push(
                "Ooops..."
            );
            res.json({
                error: true,
                message: errors
            });
        }else{
            const product = req.body;
            const newProduct = new Product(product);       
            newProduct.save()
            .then(() => {
                console.log("Product registered!");
                res.json({
                    error: false,
                    message: "New product added to stock"
                });
            }).catch((err) => {
                console.log("Product Registration Error: " + err);
                errors.push(
                    "Ooops..."
                );
                res.json({
                    error: true,
                    message: err.message
                });
            });              
        } 
    }catch(err){
        errors.push(
            "Ooops..."
        );
        res.json({
            error: true,
            message: err.message
        });
    }
    
});

router.get('/orders/new', async (req, res) => {
    try {
        let orders = await Order.find().lean();
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

router.post('/orders/ship', async (req, res) => {
    try{
        let orderNum = req.body.order.orderNumber;
        Order.findOne({
            orderNumber: orderNum
        }).then((order) => {
            //console.log("FOUND THE OLD ORDER: " + order._id);
            //order.shippingDate = Date.now().toString(),
            OldOrder.insertMany(order)
            .then(() => {
                console.log("Order saved on Orders History!");
            }).then(() => {
                Order.deleteOne({
                    orderNumber: orderNum
                }).then(() => {
                    console.log("Order deleted from New Orders.");
                    res.json({
                        error: false,
                    });
                    
                }).catch((err) => {
                    console.log("Failed deleting order from New Orders! Error: " + err);
                    res.json({
                        error: true,
                        message: err.message
                    });
                });
            }).catch((err) => {
                console.log("Error shipping this Order: " + err);
                res.json({
                    error: true,
                    message: err.message
                });
            }); 

        }).catch((err) => {
            console.log("Ooops! Failed shipping this order! Error: " + err);
            res.json({
                error: true,
                message: err.message
            });
        });
    }catch(err){
        res.json({
            error: true,
            message: err.message
        });
    }
});

router.get('/orders/history', async (req, res) => {
    try {
        let orders = await OldOrder.find().lean();
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

module.exports = router;