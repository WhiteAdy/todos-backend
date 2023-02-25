import express from 'express';

const todosRoute = express.Router();

todosRoute.use((req, res, next) => {
	console.log('hello from todos');
	if (!req.headers?.authorization) {
		return res.status(401).send('Not authorized!');
	}
	next();
});

export default todosRoute;
