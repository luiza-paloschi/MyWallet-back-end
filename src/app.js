import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import joi from 'joi';
import bcrypt from 'bcrypt';

dotenv.config();


const mongoClient = new MongoClient(process.env.DATABASE_URL);
let db;

try {
  await mongoClient.connect();
  db = mongoClient.db();
} catch (error) {
  console.error(error);
  console.log('Houve um erro de conexão com o banco de dados');
}

const app = express()
app.use(cors())
app.use(express.json())

app.post("/cadastro", async (req, res) => {
  
    const {name, email, password, confirm_password} = req.body
  
    const userSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
        confirm_password: joi.string().valid(joi.ref('password')).required()
    });
    
    const { error } = userSchema.validate({name, email, password, confirm_password}, { abortEarly: false });
    if (error) return res.status(422).send();

    try {
    const userExists = await db.collection("users").findOne({ name, email });
    if (userExists) return res.status(409).send('Usuário duplicado');

    const passwordHash = bcrypt.hashSync(password, 10);
    await db.collection("users").insertOne({name, email, password: passwordHash});

    res.status(201).send("Usuário cadastrado com sucesso!")
  } catch (error) {
    console.error(error)
    res.status(500).send('Algo deu errado')
  }
})

app.post("/", async (req, res) => {
  

    try {
    
  } catch (error) {
    console.error(error)
    res.status(500).send('Algo deu errado')
  }
})

const PORT = 5000

app.listen(PORT, () => console.log('O servidor está rodando'))