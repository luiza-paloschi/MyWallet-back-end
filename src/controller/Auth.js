import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'
import db from '../config/database.js'


export async function signUp(req, res){
    const {name, email, password} = req.body
  
    try {
    const userExists = await db.collection("users").findOne({ $or: [ { name }, { email} ] });
    if (userExists) return res.status(409).send('Este usuário já está cadastrado!');

    const passwordHash = bcrypt.hashSync(password, 10);
    await db.collection("users").insertOne({name, email, password: passwordHash});

    res.status(201).send("Usuário cadastrado com sucesso!")
  } catch (error) {
    console.error(error)
    res.status(500).send('Algo deu errado')
  }
}

export async function signIn(req, res){
    const {email, password} = req.body;

    try {

      const user = await db.collection('users').findOne({ email });
      if(!user  || (user && !bcrypt.compareSync(password, user.password))) return res.status(404).send("Usuário ou senha incorretos!");
      
      const token = uuid();

      const logged = await db.collection("sessions").findOne({userId: user._id});
      if (logged) {
        await db.collection("sessions").updateOne({ name: logged.name }, 
          {
              $set: {
                  token
              }
          });
        return res.send({token, name: user.name});
      }
        
      await db.collection("sessions").insertOne({
        userId: user._id,
        token,
        name: user.name
      });

      res.send({token, name: user.name});
  
  } catch (error) {
    console.error(error);
    res.status(500).send('Algo deu errado');
  }
}