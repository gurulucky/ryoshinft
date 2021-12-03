const mongoose = require('mongoose');
require('dotenv').config();
// const config = require('config');
// const db = config.get('mongoURI');
const NETWORK = process.env.NETWORK;
const DB_NAME = NETWORK === 'rinkeby' ? process.env.TEST_DB : process.env.MAIN_DB;
const db = `mongodb://localhost:27017/${DB_NAME}`;

const connectDB = async () => {
	try {
		await mongoose.connect((NETWORK === 'rinkeby' ? process.env.MONGODB_URI_TEST : process.env.MONGODB_URI_MAIN) || db, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true
		});

		console.log('MongoDB Connected...', db);
	} catch (err) {
		console.error(err.message);
		// Exit process with failure
		process.exit(1);
	}
};

module.exports = connectDB;
