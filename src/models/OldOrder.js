const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const oldOrderSchema = new Schema({
    _id: {
		type: String,
		required: true
	},
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
    },
    isFinished: {
        type: Boolean,
        default: true
    },
    shippingDate: {
        type: Date,
        default: Date.now().toString()
    }
});

mongoose.model('OldOrder', oldOrderSchema);