import express from 'express';
import cors from 'cors';
import authRouter from './routes/AuthRoutes.js';
import registriesRouter from './routes/RegistriesRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use([authRouter, registriesRouter]);

app.listen(process.env.PORT, () => console.log('O servidor está rodando'));