const { HTTP_FORBIDDEN } = require('../../../constants')
const GeneralError = require('./general-error')

class ForbiddenException extends GeneralError {
  constructor(message) {
    super()
    this.message = message
    this.status = HTTP_FORBIDDEN
  }
}

export default ForbiddenException
