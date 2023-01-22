import { Router } from "express";
import { getRegistries, newRegistry } from "../controller/Registries.js";
import { authValidation } from "../middleware/AuthMiddleware.js";
import { validateEntrySchema } from "../middleware/validateSchema.js";
import { entrySchema } from "../schemas/RegistriesSchemas.js";


const registriesRouter = Router();

registriesRouter.get("/home", authValidation, getRegistries);
registriesRouter.post("/novo-registro", authValidation, validateEntrySchema(entrySchema), newRegistry);

export default registriesRouter;