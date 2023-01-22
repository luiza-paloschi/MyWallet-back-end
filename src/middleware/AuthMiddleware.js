import db from "../config/database.js";


export async function authValidation(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", '');
    if (!token) return res.status(401).send("Você não tem autorização para realizar essa ação!");
  
    try {
      const session = await db.collection("sessions").findOne({ token });
  
      if (!session) return res.status(401).send("Você não tem autorização para realizar essa ação!");
  
      res.locals.session = session;
  
      next();
  
    } catch (error) {
      res.status(500).send(error);
    }
  }
  