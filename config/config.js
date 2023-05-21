require("dotenv").config();
const config = {
	development: {
		username: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		database: process.env.POSTGRES_DB,
		host: process.env.POSTGRES_HOST,
		dialect: "postgres",
		secretKey : process.env.JWT_SECRET
	},
	test: {
		username: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		database: process.env.POSTGRES_TEST_DB,
		host: process.env.POSTGRES_HOST,
		dialect: "postgres",
	},
};

module.exports = config;
