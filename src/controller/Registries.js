import dayjs from "dayjs";
import db from '../config/database.js';

export async function newRegistry(req, res){
  const {value, description, type} = req.body
    const newValue = Number(value.replace(",", "."))
    const session = res.locals.session
  try {
    await db.collection("wallets").insertOne(
      { accountId: session.userId, value: newValue, description, type, date: `${dayjs().date()}/${dayjs().month() + 1}`})
  
    res.sendStatus(201)
  } catch (error) {
    res.status(500).send(error);
  }

}
export async function getRegistries(_, res){
  const session = res.locals.session

  try {
    const registries = await db.collection("wallets").find({ 
      accountId: session.userId 
    }).toArray()
    res.send(registries);
  } catch (error) {
    res.status(500).send(error);
  }
}
  
export async function newEntry(req, res){
    const {value, description} = req.body
    const newValue = Number(value.replace(",", "."))
    const session = res.locals.session
  try {
    await db.collection("wallets").insertOne(
      { accountId: session.userId, value: newValue, description, type: "entry", date: `${dayjs().date()}/${dayjs().month() + 1}`})
  
    res.sendStatus(201)
  } catch (error) {
    res.status(500).send(error);
  }
}
  
export async function newOutflow(req, res){
    
    const {value, description} = req.body
    const newValue = Number(value.replace(",", "."))
    const session = res.locals.session
    
    try {
      await db.collection("wallets").insertOne(
        { accountId: session.userId, value: newValue, description, type: "outflow", date: `${dayjs().date()}/${dayjs().month() + 1}`})
    
      res.sendStatus(201)
    } catch (error) {
      res.status(500).send(error);
    }
}