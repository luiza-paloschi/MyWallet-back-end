import joi from "joi";


export const entrySchema = joi.object({
    value: joi.number().positive().unsafe().required().messages(
      {"number.base": "o campo valor deve ser um número e estar em um dos seguintes formatos: 50; 50.00; 50,00"}
    ),
    description: joi.string().required(),
    type: joi.string().valid("entry", "outflow").required()
  }).messages(
    {"number.positive": "o valor deve ser um número positivo"}
  );