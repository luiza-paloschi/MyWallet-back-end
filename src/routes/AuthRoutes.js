import { Router } from "express";
import { signIn, signUp } from "../controller/Auth.js";
import { validateSchema } from "../middleware/validateSchema.js";
import { loginSchema, userSchema } from "../schemas/AuthSchemas.js";

const authRouter = Router();

authRouter.post("/cadastro", validateSchema(userSchema), signUp);
authRouter.post("/", validateSchema(loginSchema), signIn);

export default authRouter;