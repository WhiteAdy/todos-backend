import express from 'express';

const loginRoute = express.Router();

loginRoute.use((req, res, next) => {
	console.log('hello from login');
	next();
});

export default loginRoute;
