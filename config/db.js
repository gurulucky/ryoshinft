const mongoose = require('mongoose');
// const config = require('config');
// const db = config.get('mongoURI');
const NETWORK = process.env.NETWORK;
const DB_NAME = NETWORK === 'rinkeby' ? process.env.TEST_DB : process.env.MAIN_DB;
const db = `mongodb://localhost:27017/${DB_NAME}`;

const connectDB = async () => {
	try {
		await mongoose.connect(db, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true
		});

		console.log('MongoDB Connected...');
	} catch (err) {
		console.error(err.message);
		// Exit process with failure
		process.exit(1);
	}
};

module.exports = connectDB;
