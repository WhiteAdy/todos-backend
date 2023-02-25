import express from 'express';
import { prisma } from '..';
import bcrypt from 'bcrypt';
import { isValidEmail } from '../utils';

const registerRoute = express.Router();

registerRoute.post('/', async (req, res) => {
	const { email, password } = req?.body;

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

	if (existingUser) {
		return res.status(400).send('Email is already registered!');
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	try {
		await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
			},
		});
		return res.status(200).send('Successfully registered a new user!');
	} catch (e) {
		console.log('there was an error creating the user: ', e);
	}
});

export default registerRoute;
