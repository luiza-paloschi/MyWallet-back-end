import joi from "joi";

export const userSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required().messages(
        {"string.email": "o campo e-mail deve conter um e-mail válido"},
    ),
    password: joi.string().required(),
    confirm_password: joi.string().valid(joi.ref('password')).required().messages(
        {"any.only": "'confirmação de senha' deve ser igual a 'senha'"},
    )
}).messages(
    {"string.base": "todos os campos devem estar em formato de texto"},
    {"string.empty": "todos os campos devem estar preenchidos"}
    );

export const loginSchema = joi.object({
    email: joi.string().email().required().messages(
        {"string.email": "o campo e-mail deve conter um e-mail válido"},
    ),
    password: joi.string().required(),
  }).messages(
    {"string.base": "todos os campos devem estar em formato de texto"},
    {"string.empty": "todos os campos devem estar preenchidos"}
    );