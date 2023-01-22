export function validateSchema(schema) {
    return (req, res, next) => {
      const { error } = schema
        .validate(req.body, { abortEarly: false })
  
      if (error) return res.status(422).send(error.details[0].message)
      next()
    }
}

export function validateEntrySchema(schema){
    return (req, res, next) => {
        const {value, description, type} = req.body
        const newValue = Number(value.replace(",", "."))
        const { error } = schema
          .validate({value: newValue, description, type}, { abortEarly: false })
    
        if (error) return res.status(422).send(error.details[0].message)
        next()
      }
}