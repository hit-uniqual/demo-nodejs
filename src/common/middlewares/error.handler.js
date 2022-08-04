import { HTTP_INTERNAL_SERVER, HTTP_UNPROCESSABLE } from '../../../constants'
import GeneralError from '../exceptions/general-error'

export default (error, req, res, next) => {
  if (error instanceof GeneralError) {
    return res.status(error.status).json({ message: error.message })
  }

  if (error && error.error && error.error.isJoi) {
    return res.status(HTTP_UNPROCESSABLE).json({
      message: 'The given data is invalid',
      errors: error.error.details,
    })
  }

  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    return res.render('errors/500')
  }

  if (process.env.NODE_ENV !== 'production') {
    return res.status(HTTP_INTERNAL_SERVER).json({
      message: error.message,
      stack: error.stack,
    })
  }

  console.log(error)
  return res.status(HTTP_INTERNAL_SERVER).json({
    message: 'Internal Server Error',
  })
}
