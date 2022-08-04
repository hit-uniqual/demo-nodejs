const { HTTP_BAD_REQUEST } = require('../../../constants')
const GeneralError = require('./general-error')

class BadRequestException extends GeneralError {
  constructor(message) {
    super()
    this.message = message
    this.status = HTTP_BAD_REQUEST
  }
}

export default BadRequestException
