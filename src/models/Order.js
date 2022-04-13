const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    orderNumber: {
		type: String,
		required: true
	},
    listproducts: {
        type: Object,
        required: true
    },
    productsPrice: {
		type: Number,
		required: true
	},
    shipping: {
        type: Object,
        required: true
    },
    customer: {
        type: Object,
        required: true
    },
    payment: {
        type: Object,
        required: true
    }
});

mongoose.model('Order', orderSchema);