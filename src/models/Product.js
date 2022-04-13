const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
	_id: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	department: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	additionalInfo: {
		type: String,
		required: true
	},
	quantity: {
		type: Number,
		required: true
	},
	img1: {
		type: String,
		required: true
	},
	img2: {
		type: String,
		required: true
	},
	img3: {
		type: String,
		required: true
	}
});

mongoose.model('Product', productSchema);