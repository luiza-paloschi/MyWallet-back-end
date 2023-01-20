import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import joi from 'joi';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import dayjs from "dayjs"

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
    const {email, password} = req.body

    const LoginSchema = joi.object({
      email: joi.string().email().required(),
      password: joi.string().required(),
    });

    const validation = LoginSchema.validate({email, password}, { abortEarly: false });
  
  if (validation.error) {
    const errors = validation.error.details.map((detail) => detail.message);
    return res.status(422).send(errors);
  }

    try {

      const user = await db.collection('users').findOne({ email });
      if(!user  || (user && !bcrypt.compareSync(password, user.password))) return res.status(404).send("Usuário ou senha incorretos!")
      
      const token = uuid();

      const logged = await db.collection("sessions").findOne({userId: user._id})
      if (logged) {
        await db.collection("sessions").updateOne({ name: logged.name }, 
          {
              $set: {
                  token
              }
          })
        return res.send({token, name: user.name})
      }
        
      await db.collection("sessions").insertOne({
        userId: user._id,
        token,
        name: user.name
      })

      res.send({token, name: user.name})
  
  } catch (error) {
    console.error(error)
    res.status(500).send('Algo deu errado')
  }
})

app.get("/home", async(req,res) => {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');

  if(!token) return res.sendStatus(401);

  const session = await db.collection("sessions").findOne({ token });
            
  if (!session) {
      return res.sendStatus(401);
  }

	const registries = await db.collection("wallets").find({ 
		accountId: session.userId 
	}).toArray()
  console.log(registries)
  res.send(registries)
})

app.post("/nova-entrada", async(req, res) =>{
  const { authorization } = req.headers;
  const {value, description} = req.body
  const newValue = Number(value.replace(",", "."))

  const token = authorization?.replace('Bearer ', '');

  if(!token) return res.sendStatus(401);

  const session = await db.collection("sessions").findOne({ token });
            
  if (!session) return res.sendStatus(401);

  const entrySchema = joi.object({
    value: joi.number().required(),
    description: joi.string().required(),
  });

  const { error } = entrySchema.validate({value: newValue, description}, { abortEarly: false });
  if (error) return res.status(422).send(error);

  await db.collection("wallets").insertOne(
    { accountId: session.userId, value: newValue, description, type: "entry", date: `${dayjs().date()}/${dayjs().month() + 1}`})

  res.sendStatus(201)

})

app.post("/nova-saida", async(req, res) =>{
  const { authorization } = req.headers;
  const {value, description} = req.body
  const newValue = Number(value.replace(",", "."))

  const token = authorization?.replace('Bearer ', '');

  if(!token) return res.sendStatus(401);

  const session = await db.collection("sessions").findOne({ token });
            
  if (!session) return res.sendStatus(401);

  const outflowSchema = joi.object({
    value: joi.number().required(),
    description: joi.string().required(),
  });

  const { error } = outflowSchema.validate({value: newValue, description}, { abortEarly: false });
  if (error) return res.status(422).send(error);

  await db.collection("wallets").insertOne(
    { accountId: session.userId, value: newValue, description, type: "outflow", date: `${dayjs().date()}/${dayjs().month() + 1}`})

  res.sendStatus(201)

})


const PORT = 5000

app.listen(PORT, () => console.log('O servidor está rodando'))