import Joi from 'joi'

export default Joi.object({
  email: Joi.string().email().optional(),
  otp: Joi.number().integer().required(),
})
