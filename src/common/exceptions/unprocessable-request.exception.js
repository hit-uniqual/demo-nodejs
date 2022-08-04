const { HTTP_UNPROCESSABLE } = require('../../../constants')
const GeneralError = require('./general-error')

class UnprocessableException extends GeneralError {
  constructor(message) {
    super()
    this.message = message
    this.status = HTTP_UNPROCESSABLE
  }
}

export default UnprocessableException
