import express from 'express';
import dotenv from 'dotenv';
import { loginRoute, registerRoute, todosRoute } from './routes';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

const PORT = process.env.SERVER_PORT;

app.listen(PORT, () => console.log(`[server]: listening on port ${PORT}`));

app.use('/login', loginRoute);
app.use('/register', registerRoute);
app.use('/todos', todosRoute);

export { prisma };
