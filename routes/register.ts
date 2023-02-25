import express from 'express';

const registerRoute = express.Router();

registerRoute.post('/', (req, res) => {
	const { username, password } = req?.body;
	if (!(username && password)) {
		return res.status(400).send('Username or password missing!');
	}

	res.send('sent response from register');
});

export default registerRoute;
