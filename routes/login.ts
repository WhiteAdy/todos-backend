import express from 'express';
import { prisma } from '..';
import bcrypt from 'bcrypt';
import { isValidEmail } from '../utils';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../constants';

const loginRoute = express.Router();

loginRoute.post('/', async (req, res) => {
	const { email, password } = req.body;

	if (!(email && password)) {
		return res.status(400).send('Email or password fields missing!');
	}

	if (!isValidEmail(email)) {
		return res.status(400).send('Email is invalid!');
	}

	const existingUser = await prisma.user.findUnique({
		where: {
			email,
		},
	});

	if (!existingUser) {
		return res.status(404).send('Email or password incorrect!');
	}

	const isPasswordValid = await bcrypt.compare(
		password,
		existingUser.password
	);

	if (!isPasswordValid) {
		return res.status(404).send('Email or password incorrect!');
	}

	const newToken = jwt.sign(
		{ id: existingUser.id, email: existingUser.email },
		JWT_SECRET,
		{ expiresIn: '15m' }
	);

	return res.status(200).json(newToken);
});

export default loginRoute;
