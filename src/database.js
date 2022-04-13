const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env')});

//console.log(process.env.MONGO_URL);

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
	useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB connected!");
}).catch((err) => {
    console.log(err);
});