const mongoose = require('mongoose');
require('dotenv').config();
// const config = require('config');
// const db = config.get('mongoURI');
const NETWORK = process.env.NETWORK;
const MONGO_URI = NETWORK === 'rinkeby' ? process.env.TEST_DB : process.env.MAIN_DB;

const connectDB = async () => {
	try {
		await mongoose.connect(MONGO_URI, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true
		});

		console.log('MongoDB Connected...', MONGO_URI);
	} catch (err) {
		console.error(err.message);
		// Exit process with failure
		process.exit(1);
	}
};

module.exports = connectDB;
