import express from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '..';

const todosRoute = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

todosRoute.use((req, res, next) => {
	const { authorization } = req.headers;
	const bearer = authorization?.split('Bearer ')[1];

	if (!(authorization && bearer)) {
		return res.status(401).send('Unauthorized!');
	}

	jwt.verify(bearer, JWT_SECRET!, (err, user) => {
		if (err) return res.status(401).send('Unauthorized!');

		// Extend the request body with the user obtained from the JWT
		req.body.user = user;
		next();
	});
});

todosRoute.post('/', async (req, res) => {
	const { title, completed, user } = req.body;

	if (!title) return res.status(400).send('Title is missing!');

	try {
		const createdTodo = await prisma.todo.create({
			data: {
				title,
				userId: user.id,
				...(completed && { completed }),
			},
		});
		res.status(201).json(createdTodo);
	} catch (e) {
		res.status(500).send('Unable to create the todo!');
	}
});

todosRoute.patch('/:id', async (req, res) => {
	const { id } = req.params;
	const { completed } = req.body;

	if (typeof completed !== 'boolean')
		return res.status(400).send('"Completed" prop is missing!');

	const existingTodo = await prisma.todo.findUnique({
		where: {
			id: Number(id),
		},
	});

	if (!existingTodo) return res.status(400).send('Todo item does not exist!');

	try {
		await prisma.todo.update({
			where: {
				id: Number(id),
			},
			data: {
				completed,
			},
		});

		return res.status(200).send('Todo item changed!');
	} catch (e) {
		res.status(500).send('Unable to change the status of the todo item!');
	}
});

export default todosRoute;
